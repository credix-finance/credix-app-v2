import { BN, web3 } from "@project-serum/anchor";
import { ASSOCIATED_TOKEN_PROGRAM_ID, Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import Big from "big.js";
import { BorrowerInfo, CredixClient, CredixPass, Deal, Ratio } from "..";
import { CredixPassConfig } from "../config";
import { CredixProgram, GlobalMarketState } from "../idl/idl.types";
import { asyncFilter } from "../utils/async.utils";
import { ZERO } from "../utils/math.utils";
import { encodeSeedString, findSigningAuthorityPDA } from "../utils/pda.utils";

/**
 * Represents a Credix market. Main entrypoint for market interactions
 */
export class Market {
	/**
	 * Name of the market
	 */
	name: string;
	/**
	 * Address of the market
	 */
	address: PublicKey;
	private program: CredixProgram;
	private programVersion: GlobalMarketState;
	private client: CredixClient;

	/**
	 * @ignore
	 */
	// TODO: move towards private constructor with static load function.
	// Right now we don't check whether the market data is from the on-chain data at address
	constructor(
		market: GlobalMarketState,
		name: string,
		program: CredixProgram,
		address: PublicKey,
		client: CredixClient
	) {
		this.programVersion = market;
		this.name = name;
		this.program = program;
		this.address = address;
		this.client = client;
	}

	/**
	 * Deposit into the market's liquidity pool
	 * @param amount Amount to deposit
	 * @returns promise with the transaction signature
	 */
	async deposit(amount: number) {
		const investor = this.program.provider.wallet.publicKey;
		const gatewayToken = await this.client.getGatewayToken(investor, this.gateKeeperNetwork);

		if (!gatewayToken) {
			throw Error("No valid Civic gateway token found");
		}

		const [signingAuthority] = await this.generateSigningAuthorityPDA();
		const investorTokenAccount = await this.findBaseTokenAccount(investor);
		const liquidityPoolTokenAccount = await this.findLiquidityPoolTokenAccount();
		const investorLPTokenAccount = await this.findLPTokenAccount(investor);
		const [credixPass] = await this.generateCredixPassPDA(investor);

		return this.program.rpc.depositFunds(new BN(amount), {
			accounts: {
				investor,
				gatewayToken: gatewayToken.publicKey,
				globalMarketState: this.address,
				signingAuthority: signingAuthority,
				investorTokenAccount: investorTokenAccount,
				liquidityPoolTokenAccount: liquidityPoolTokenAccount,
				lpTokenMint: this.lpMintPK,
				investorLpTokenAccount: investorLPTokenAccount,
				baseTokenMint: this.baseMintPK,
				tokenProgram: TOKEN_PROGRAM_ID,
				credixPass,
				systemProgram: SystemProgram.programId,
				rent: web3.SYSVAR_RENT_PUBKEY,
				associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
			},
		});
	}

	/**
	 * Withdraw from the market's liquidity pool
	 * @param amount to withdraw
	 * @returns promise with the transaction signature
	 */
	async withdraw(amount: number) {
		const investor = this.program.provider.wallet.publicKey;
		const gatewayToken = await this.client.getGatewayToken(investor, this.gateKeeperNetwork);

		if (!gatewayToken) {
			throw Error("No valid Civic gateway token found");
		}

		const [signingAuthority] = await this.generateSigningAuthorityPDA();
		const investorTokenAccount = await this.findBaseTokenAccount(investor);
		const liquidityPoolTokenAccount = await this.findLiquidityPoolTokenAccount();
		const investorLPTokenAccount = await this.findLPTokenAccount(investor);
		const [credixPass] = await this.generateCredixPassPDA(investor);

		return this.program.rpc.withdrawFunds(new BN(amount), {
			accounts: {
				investor,
				gatewayToken: gatewayToken.publicKey,
				globalMarketState: this.address,
				signingAuthority: signingAuthority,
				investorLpTokenAccount: investorLPTokenAccount,
				investorTokenAccount: investorTokenAccount,
				liquidityPoolTokenAccount: liquidityPoolTokenAccount,
				treasuryPoolTokenAccount: this.treasury,
				lpTokenMint: this.lpMintPK,
				credixPass,
				baseTokenMint: this.baseMintPK,
				tokenProgram: TOKEN_PROGRAM_ID,
				associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
			},
		});
	}

	// TODO: use ratio for financingFee
	// TODO: create deal config for creation
	/**
	 * Create a deal for this market
	 * @param principal Principal of the deal
	 * @param financingFee Financing fee of the deal. This is the annualized interest rate that needs to be repaid on top of the principal
	 * @param timeToMaturity Time until the principal has to be repaid. Should be a multiple of 30.
	 * @param borrower Borrower for which we create the deal.
	 * @param dealName Name of the deal.
	 * @returns promise with the transaction signature
	 */
	async createDeal(
		principal: number,
		financingFee: number,
		timeToMaturity: number,
		borrower: PublicKey,
		dealName: string
	) {
		// TODO: add validations
		if (timeToMaturity % 30) {
			throw Error("Time to maturity needs to be a multiple of 30");
		}

		const gatewayToken = await this.client.getGatewayToken(borrower, this.gateKeeperNetwork);

		if (!gatewayToken) {
			throw new Error("No valid Civic gateway token found");
		}

		const [borrowerInfoAddress] = await BorrowerInfo.generatePDA(borrower, this);
		const borrowerInfo = await this.fetchBorrowerInfo(borrower);
		const dealNumber = borrowerInfo ? borrowerInfo.numberOfDeals : 0;
		const [dealAddress] = await Deal.generatePDA(borrower, dealNumber, this);
		const [credixPassAddress] = await CredixPass.generatePDA(borrower, this);

		const principalAmount = new BN(principal);
		const financingFeeRatio = Ratio.fromNumber(financingFee);

		return this.program.rpc.createDeal(
			principalAmount,
			financingFeeRatio.toIDLRatio(),
			0,
			{ numerator: 0, denominator: 100 },
			timeToMaturity,
			dealName,
			{
				accounts: {
					owner: this.program.provider.wallet.publicKey,
					gatewayToken: gatewayToken.publicKey,
					borrower: borrower,
					borrowerInfo: borrowerInfoAddress,
					globalMarketState: this.address,
					credixPass: credixPassAddress,
					deal: dealAddress,
					systemProgram: SystemProgram.programId,
				},
			}
		);
	}

	/**
	 * Address of the program to which this market belongs
	 */
	get programId() {
		return this.program.programId;
	}

	/**
	 * Address of the base mint for this market. Base tokens are the currency deals are created for (e.g. USDC)
	 */
	get baseMintPK() {
		return this.programVersion.baseTokenMint;
	}

	/**
	 * Address of the mint of LP token.
	 */
	get lpMintPK() {
		return this.programVersion.lpTokenMint;
	}

	/**
	 * Address of the treasury of this market
	 */
	get treasury() {
		return this.programVersion.treasuryPoolTokenAccount;
	}

	/**
	 * Withdrawal fee for this market
	 */
	get withdrawFee() {
		return new Ratio(
			this.programVersion.withdrawalFee.numerator,
			this.programVersion.withdrawalFee.denominator
		);
	}

	/**
	 * Interest repayment fee for this market. This is taken from the repayments, not added on top.
	 */
	get interestFee() {
		return this.programVersion.interestFee;
	}

	/**
	 * @returns current supply of LP tokens for the lp mint this market uses
	 */
	getLPSupply() {
		const lpTokenMint = this.lpMintPK;
		return this.program.provider.connection
			.getTokenSupply(lpTokenMint)
			.then((response) => response.value);
	}

	/**
	 * @returns current price of base in LP
	 */
	async getLPPrice() {
		const tvl = Big(await this.calculateTVL());
		const lpSupply = await this.getLPSupply();
		const lpSupplyBig = new Big(lpSupply.amount);

		if (tvl.eq(ZERO)) {
			return 1;
		}

		return lpSupplyBig.div(tvl).toNumber();
	}

	/**
	 * @returns current price of lp in base
	 */
	async getBasePrice() {
		const lpPrice = await this.getLPPrice();
		return Big(1).div(Big(lpPrice)).toNumber();
	}

	/**
	 * @param pk Public key to find the associated token account for
	 * @returns an associated token address for the base mint
	 */
	// TODO: move to Mint class when available
	findBaseTokenAccount(pk: PublicKey) {
		return Token.getAssociatedTokenAddress(
			ASSOCIATED_TOKEN_PROGRAM_ID,
			TOKEN_PROGRAM_ID,
			this.baseMintPK,
			pk,
			true
		);
	}

	/**
	 * @param pk Public key to find the associated token account for
	 * @returns an associated token address for the lp mint
	 */
	// TODO: move to Mint class when available
	findLPTokenAccount(pk: PublicKey) {
		return Token.getAssociatedTokenAddress(
			ASSOCIATED_TOKEN_PROGRAM_ID,
			TOKEN_PROGRAM_ID,
			this.lpMintPK,
			pk,
			true
		);
	}

	/**
	 * @param user Public key for which we find the base balance
	 * @returns the amount of 'base' the user has
	 */
	async userBaseBalance(user: PublicKey) {
		const userBaseTokenAccount = await this.findBaseTokenAccount(user);
		const response = await this.program.provider.connection.getTokenAccountBalance(
			userBaseTokenAccount
		);
		return response.value;
	}

	/**
	 * @param user Public key for which we find the LP amount
	 * @returns the amount of LP the user has
	 */
	async userLPBalance(user: PublicKey) {
		const userLPTokenAccount = await this.findLPTokenAccount(user);
		const response = await this.program.provider.connection.getTokenAccountBalance(
			userLPTokenAccount
		);

		return response.value;
	}

	/**
	 * @returns the amount of base in the liquidity pool
	 */
	async fetchLiquidityPoolBalance() {
		const liquidityPoolBaseTokenAccountPK = await this.findLiquidityPoolTokenAccount();
		const response = await this.program.provider.connection.getTokenAccountBalance(
			liquidityPoolBaseTokenAccountPK
		);
		return response.value;
	}

	/**
	 * Gets how much principal is currently being lend out in deals
	 */
	get totalOutstandingCredit() {
		return this.programVersion.totalOutstandingCredit.toNumber();
	}

	/**
	 * The gatekeeper network this market uses for identity identification
	 */
	get gateKeeperNetwork() {
		return this.programVersion.gatekeeperNetwork;
	}

	/**
	 * @param borrower Borrower to which the deal belongs
	 * @param dealNumber The id of the deal, scoped to the borrower
	 * @returns a Deal instance or null if the deal doesn't exist
	 */
	async fetchDeal(borrower: PublicKey, dealNumber: number) {
		const [dealAddress] = await Deal.generatePDA(borrower, dealNumber, this);
		const programDeal = await this.program.account.deal.fetchNullable(dealAddress);

		if (!programDeal) {
			return programDeal;
		}

		return new Deal(programDeal, this, dealAddress, this.program, this.client);
	}

	/**
	 * Calculates the weighted average financing fee
	 * @returns
	 */
	async calculateWeightedAverageFinancingFee() {
		const deals = await this.fetchDeals();
		let principalSum = new Big(0);

		const runningFinancingFee = deals.reduce((result, deal) => {
			if (deal.isInProgress()) {
				const percentage = deal.financingFeePercentage.apply(deal.principal);
				principalSum = principalSum.add(deal.principal);
				result = result.add(percentage);
			}

			return result;
		}, new Big(0));

		if (principalSum.eq(0)) {
			return new Ratio(0, 1);
		}

		// TODO: what does ff mean?
		const ff = runningFinancingFee.div(principalSum);
		const numerator = ff.mul(100);

		return new Ratio(numerator.toNumber(), 100);
	}

	/**
	 * Calculates the total value locked of the market (liquidity pool balance + total outstanding credit)
	 * @returns
	 */
	async calculateTVL() {
		const liquidityPoolBalanceTokenAmount = await this.fetchLiquidityPoolBalance();
		const liquidityPoolBalance = Big(liquidityPoolBalanceTokenAmount.amount);
		const tvl = Big(this.totalOutstandingCredit).add(liquidityPoolBalance);

		return tvl.toNumber();
	}

	/**
	 * Fetches all the deals that belong to this market
	 * @returns
	 */
	async fetchDeals() {
		const deals = await this.program.account.deal.all();

		const marketDeals = await asyncFilter(deals, async (deal) => {
			const [dealPDA] = await Deal.generatePDA(
				deal.account.borrower,
				deal.account.dealNumber,
				this
			);

			return dealPDA.equals(deal.publicKey);
		});

		return marketDeals.map(
			(deal) => new Deal(deal.account, this, deal.publicKey, this.program, this.client)
		);
	}

	/**
	 * Fetches the account containing borrower info for this market
	 * @param borrower
	 * @returns
	 */
	async fetchBorrowerInfo(borrower: PublicKey) {
		const [address] = await BorrowerInfo.generatePDA(borrower, this);
		const programBorrower = await this.program.account.borrowerInfo.fetchNullable(address);

		if (!programBorrower) {
			return programBorrower;
		}

		return new BorrowerInfo(programBorrower, this, address, borrower, this.client);
	}

	/**
	 * Fetches a credix pass
	 * @param borrower Public key for which we fetch a credix pass
	 * @returns
	 */
	async fetchCredixPass(borrower: PublicKey) {
		const [passAddress] = await CredixPass.generatePDA(borrower, this);
		const pass = await this.program.account.credixPass.fetchNullable(passAddress);

		if (!pass) {
			return null;
		}

		return new CredixPass(pass, passAddress);
	}

	/**
	 * Generate a market PDA address
	 * @param marketName
	 * @param programId
	 * @returns
	 */
	static generatePDA(marketName: string, programId: PublicKey) {
		const seed = encodeSeedString(marketName);
		return PublicKey.findProgramAddress([seed], programId);
	}

	/**
	 * @param marketName
	 * @param programId
	 * @returns the lp token mint address that would belong to a market with a certain name
	 */
	// TODO: add tests for wrong mint and pda check
	static async generateLPTokenMintPDA(marketName: string, programId: PublicKey) {
		const [marketAddress] = await Market.generatePDA(marketName, programId);
		const lpTokenMintSeed = [marketAddress.toBuffer(), encodeSeedString("lp-token-mint")];
		return PublicKey.findProgramAddress(lpTokenMintSeed, programId);
	}

	// TODO: add pda generation tests with static, know, reference addresses
	private generateCredixPassPDA(pk: PublicKey) {
		const credixSeed = encodeSeedString("credix-pass");
		const seed = [this.address.toBuffer(), pk.toBuffer(), credixSeed];
		return PublicKey.findProgramAddress(seed, this.programId);
	}

	/**
	 * Generate the signing authority PDA address for this market
	 * @returns
	 */
	generateSigningAuthorityPDA() {
		return findSigningAuthorityPDA(this.address, this.programId);
	}

	/**
	 * Calculates the associated token account address for the liquidity pool
	 * @returns
	 */
	async findLiquidityPoolTokenAccount() {
		const [signingAuthorityPK] = await this.generateSigningAuthorityPDA();
		return this.findBaseTokenAccount(signingAuthorityPK);
	}

	/**
	 * Calculates the stake of a user expressed in base
	 * @param user Public key for which we check the stake
	 * @returns
	 */
	async getUserStake(user: PublicKey) {
		const lpPrice = await this.getLPPrice();
		const userLpTokenAmount = await this.userLPBalance(user);
		const userLpTokenAmountBig = new Big(userLpTokenAmount.amount);

		return userLpTokenAmountBig.mul(lpPrice);
	}

	/**
	 *
	 * @param pk
	 * @returns
	 */
	/**
	 * Issue a credix pass. This function requires that the client wallet to belong to a management address
	 * @param pk Public key for which we issue a credix pass
	 * @param credixPassConfig Configuration of the credix pass. @see {@link CredixPassConfig}
	 * @returns a promise with the transaction signature
	 */
	async issueCredixPass(pk: PublicKey, credixPassConfig: CredixPassConfig) {
		const [credixPassAddress] = await CredixPass.generatePDA(pk, this);

		return this.program.rpc.createCredixPass(
			credixPassConfig.underwriter,
			credixPassConfig.borrower,
			new BN(credixPassConfig.releaseTimestamp),
			{
				accounts: {
					owner: this.program.provider.wallet.publicKey,
					passHolder: pk,
					credixPass: credixPassAddress,
					systemProgram: SystemProgram.programId,
					rent: SYSVAR_RENT_PUBKEY,
					globalMarketState: this.address,
				},
			}
		);
	}

	/**
	 * Update a credix pass. This function requires that the client wallet belongs to a management address
	 * @param pk Public key for which we update a credix pass
	 * @param credixPassConfig Configuration of the credix pass. @see {@link CredixPassConfig}
	 * @returns a promise with the transaction signature
	 */
	async updateCredixPass(pk: PublicKey, credixPassConfig: CredixPassConfig) {
		const [credixPassAddress] = await CredixPass.generatePDA(pk, this);

		return this.program.rpc.updateCredixPass(
			credixPassConfig.active !== false,
			credixPassConfig.underwriter,
			credixPassConfig.borrower,
			new BN(credixPassConfig.releaseTimestamp),
			{
				accounts: {
					owner: this.program.provider.wallet.publicKey,
					passHolder: pk,
					credixPass: credixPassAddress,
					globalMarketState: this.address,
				},
			}
		);
	}

	async freeze() {
		return this.program.rpc.freezeGlobalMarketState({
			accounts: { owner: this.program.provider.wallet.publicKey, globalMarketState: this.address },
		});
	}

	async thaw() {
		return this.program.rpc.thawGlobalMarketState({
			accounts: { owner: this.program.provider.wallet.publicKey, globalMarketState: this.address },
		});
	}

	get isFrozen() {
		return this.programVersion.frozen;
	}
}
