"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Market = void 0;
const anchor_1 = require("@project-serum/anchor");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const big_js_1 = __importDefault(require("big.js"));
const fraction_js_1 = __importDefault(require("fraction.js"));
const __1 = require("..");
const pda_utils_1 = require("../utils/pda.utils");
const async_utils_1 = require("../utils/async.utils");
const math_utils_1 = require("../utils/math.utils");
/**
 * Represents a Credix market. Main entrypoint for market interactions
 */
class Market {
    /**
     * @ignore
     */
    // TODO: move towards private constructor with static load function.
    // Right now we don't check whether the market data is from the on-chain data at address
    constructor(market, name, program, address, client) {
        this.programVersion = market;
        this.name = name;
        this.program = program;
        this.address = address;
        this.client = client;
    }
    /**
     * Deposit into the market's liquidity pool
     * @param amount Amount to deposit
     * @returns
     */
    deposit(amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const investor = this.program.provider.wallet.publicKey;
            const gatewayToken = yield this.client.getGatewayToken(investor, this.gateKeeperNetwork);
            if (!gatewayToken) {
                throw Error("No valid Civic gateway token found");
            }
            const [signingAuthority] = yield this.generateSigningAuthorityPDA();
            const investorTokenAccount = yield this.findBaseTokenAccount(investor);
            const liquidityPoolTokenAccount = yield this.findLiquidityPoolTokenAccount();
            const investorLPTokenAccount = yield this.findLPTokenAccount(investor);
            const [credixPass] = yield this.generateCredixPassPDA(investor);
            return this.program.rpc.depositFunds(new anchor_1.BN(amount.toNumber()), {
                accounts: {
                    investor,
                    gatewayToken: gatewayToken.publicKey,
                    globalMarketState: this.address,
                    signingAuthority: signingAuthority,
                    investorTokenAccount: investorTokenAccount,
                    liquidityPoolTokenAccount: liquidityPoolTokenAccount,
                    lpTokenMintAccount: this.lpMintPK,
                    investorLpTokenAccount: investorLPTokenAccount,
                    baseMintAccount: this.baseMintPK,
                    tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                    credixPass,
                    systemProgram: web3_js_1.SystemProgram.programId,
                    rent: anchor_1.web3.SYSVAR_RENT_PUBKEY,
                    associatedTokenProgram: spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID,
                },
            });
        });
    }
    /**
     * Withdraw from the market's liquidity pool
     * @param amount Amount to withdraw
     * @returns
     */
    withdraw(amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const investor = this.program.provider.wallet.publicKey;
            const gatewayToken = yield this.client.getGatewayToken(investor, this.gateKeeperNetwork);
            if (!gatewayToken) {
                throw Error("No valid Civic gateway token found");
            }
            const [signingAuthority] = yield this.generateSigningAuthorityPDA();
            const investorTokenAccount = yield this.findBaseTokenAccount(investor);
            const liquidityPoolTokenAccount = yield this.findLiquidityPoolTokenAccount();
            const investorLPTokenAccount = yield this.findLPTokenAccount(investor);
            const [credixPass] = yield this.generateCredixPassPDA(investor);
            return this.program.rpc.withdrawFunds(new anchor_1.BN(amount.toNumber()), {
                accounts: {
                    investor,
                    gatewayToken: gatewayToken.publicKey,
                    globalMarketState: this.address,
                    signingAuthority: signingAuthority,
                    investorLpTokenAccount: investorLPTokenAccount,
                    investorTokenAccount: investorTokenAccount,
                    liquidityPoolTokenAccount: liquidityPoolTokenAccount,
                    treasuryPoolTokenAccount: this.treasury,
                    lpTokenMintAccount: this.lpMintPK,
                    credixPass,
                    baseMintAccount: this.baseMintPK,
                    tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                    associatedTokenProgram: spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID,
                },
            });
        });
    }
    /**
     * Create a deal for this market
     * @param principal Principal of the deal
     * @param financingFee Financing fee of the deal. This is the annualized interest rate that needs to be repaid on top of the principal
     * @param timeToMaturity Time until the principal has to be repaid. Should be a multiple of 30.
     * @param borrower Borrower for which we create the deal.
     * @param dealName Name of the deal.
     * @returns
     */
    createDeal(principal, financingFee, timeToMaturity, borrower, dealName) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: add validations
            if (timeToMaturity % 30) {
                throw Error("Time to maturity needs to be a multiple of 30");
            }
            const gatewayToken = yield this.client.getGatewayToken(borrower, this.gateKeeperNetwork);
            if (!gatewayToken) {
                throw new Error("No valid Civic gateway token found");
            }
            const [borrowerInfoAddress, borrowerInfoBump] = yield __1.BorrowerInfo.generatePDA(borrower, this);
            const borrowerInfo = yield this.fetchBorrowerInfo(borrower);
            const dealNumber = borrowerInfo ? borrowerInfo.numberOfDeals + 1 : 0;
            const [dealAddress, dealBump] = yield __1.Deal.generatePDA(borrower, dealNumber, this);
            const [credixPassAddress] = yield __1.CredixPass.generatePDA(borrower, this);
            const principalAmount = new anchor_1.BN(principal.toNumber());
            // TODO: do we need this dependency?
            const financingFreeFraction = new fraction_js_1.default(financingFee);
            const financingFeeRatio = new __1.Ratio(financingFreeFraction.n, financingFreeFraction.d * 100);
            return this.program.rpc.createDeal(dealBump, borrowerInfoBump, principalAmount, financingFeeRatio.toIDLRatio(), 0, 0, timeToMaturity, dealName, {
                accounts: {
                    owner: this.program.provider.wallet.publicKey,
                    gatewayToken: gatewayToken.publicKey,
                    borrower: borrower,
                    borrowerInfo: borrowerInfoAddress,
                    globalMarketState: this.address,
                    credixPass: credixPassAddress,
                    deal: dealAddress,
                    systemProgram: web3_js_1.SystemProgram.programId,
                },
            });
        });
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
        return this.programVersion.liquidityPoolTokenMintAccount;
    }
    /**
     * Address of the mint of LP token.
     */
    get lpMintPK() {
        return this.programVersion.lpTokenMintAccount;
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
        return this.programVersion.withdrawalFee;
    }
    /**
     * Interest repayment fee for this market. This is taken from the repayments, not added on top.
     */
    get interestFee() {
        return this.programVersion.interestFee;
    }
    /**
     * Gets the current supply of LP tokens for the lp mint this market uses
     * @returns
     */
    getLPSupply() {
        const lpTokenMint = this.lpMintPK;
        return this.program.provider.connection
            .getTokenSupply(lpTokenMint)
            .then((response) => response.value);
    }
    /**
     * Gets the current price of LP tokens in base
     * @returns
     */
    getLPPrice() {
        return __awaiter(this, void 0, void 0, function* () {
            const tvl = yield this.calculateTVL();
            const lpSupply = yield this.getLPSupply();
            const lpSupplyBig = new big_js_1.default(lpSupply.amount);
            if (lpSupplyBig.eq(math_utils_1.ZERO)) {
                return math_utils_1.ZERO;
            }
            return tvl.div(lpSupplyBig);
        });
    }
    /**
     * Calculates the associated token account for the base mint of this market
     * @param pk Public key to find the associated token account for
     * @returns
     */
    // TODO: move to Mint class when available
    findBaseTokenAccount(pk) {
        return spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, this.baseMintPK, pk, true);
    }
    /**
     * Calculates the associated token account for the lp mint of this market
     * @param pk Public key to find the associated token account for
     * @returns
     */
    // TODO: move to Mint class when available
    findLPTokenAccount(pk) {
        return spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, this.lpMintPK, pk, true);
    }
    /**
     * Gets the amount of 'base' the user has
     * @param user Public key for which we find the base balance
     * @returns
     */
    userBaseBalance(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const userBaseTokenAccount = yield this.findBaseTokenAccount(user);
            const response = yield this.program.provider.connection.getTokenAccountBalance(userBaseTokenAccount);
            return response.value;
        });
    }
    /**
     * Gets the amount of LP the user has
     * @param user Public key for which we find the LP amount
     * @returns
     */
    userLPBalance(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const userLPTokenAccount = yield this.findLPTokenAccount(user);
            const response = yield this.program.provider.connection.getTokenAccountBalance(userLPTokenAccount);
            return response.value;
        });
    }
    /**
     * Gets how base is currently in the liquidity pool
     * @returns
     */
    fetchLiquidityPoolBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            const liquidityPoolBaseTokenAccountPK = yield this.findLiquidityPoolTokenAccount();
            const response = yield this.program.provider.connection.getTokenAccountBalance(liquidityPoolBaseTokenAccountPK);
            return response.value;
        });
    }
    /**
     * Gets how much principal is currently being lend out in deals
     */
    get totalOutstandingCredit() {
        return new big_js_1.default(this.programVersion.totalOutstandingCredit.toNumber());
    }
    /**
     * The gatekeeper network this market uses for identity identification
     */
    get gateKeeperNetwork() {
        return this.programVersion.gatekeeperNetwork;
    }
    /**
     * Fetches deal data
     * @param borrower Borrower to which the deal belongs
     * @param dealNumber The id of the deal, scoped to the borrower
     * @returns
     */
    fetchDeal(borrower, dealNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            const [dealAddress] = yield __1.Deal.generatePDA(borrower, dealNumber, this);
            const programDeal = yield this.program.account.deal.fetchNullable(dealAddress);
            if (!programDeal) {
                return programDeal;
            }
            return new __1.Deal(programDeal, this, dealAddress, this.program, this.client);
        });
    }
    /**
     * Calculates the weighted average financing fee
     * @returns
     */
    calculateWeightedAverageFinancingFee() {
        return __awaiter(this, void 0, void 0, function* () {
            const deals = yield this.fetchDeals();
            let principalSum = new big_js_1.default(0);
            const runningFinancingFee = deals.reduce((result, deal) => {
                if (deal.isInProgress()) {
                    const percentage = deal.financingFeePercentage.apply(deal.principal);
                    principalSum = principalSum.add(deal.principal);
                    result = result.add(percentage);
                }
                return result;
            }, new big_js_1.default(0));
            if (principalSum.eq(0)) {
                return new __1.Ratio(0, 1);
            }
            // TODO: what does ff mean?
            const ff = runningFinancingFee.div(principalSum);
            const numerator = ff.mul(100);
            return new __1.Ratio(numerator.toNumber(), 100);
        });
    }
    /**
     * Calculates the total value locked of the market (liquidity pool balance + total outstanding credit)
     * @returns
     */
    calculateTVL() {
        return __awaiter(this, void 0, void 0, function* () {
            const liquidityPoolBalance = yield this.fetchLiquidityPoolBalance();
            const base_in_liquidity_pool = new big_js_1.default(liquidityPoolBalance.amount);
            return this.totalOutstandingCredit.add(base_in_liquidity_pool);
        });
    }
    /**
     * Fetches all the deals that belong to this market
     * @returns
     */
    fetchDeals() {
        return __awaiter(this, void 0, void 0, function* () {
            const deals = yield this.program.account.deal.all();
            const marketDeals = yield (0, async_utils_1.asyncFilter)(deals, (deal) => __awaiter(this, void 0, void 0, function* () {
                const [dealPDA] = yield __1.Deal.generatePDA(deal.account.borrower, deal.account.dealNumber, this);
                return dealPDA.equals(deal.publicKey);
            }));
            return marketDeals.map((deal) => new __1.Deal(deal.account, this, deal.publicKey, this.program, this.client));
        });
    }
    /**
     * Fetches the account containing borrower info for this market
     * @param borrower
     * @returns
     */
    fetchBorrowerInfo(borrower) {
        return __awaiter(this, void 0, void 0, function* () {
            const [address] = yield __1.BorrowerInfo.generatePDA(borrower, this);
            const programBorrower = yield this.program.account.borrowerInfo.fetchNullable(address);
            if (!programBorrower) {
                return programBorrower;
            }
            return new __1.BorrowerInfo(programBorrower, this, address, borrower, this.client);
        });
    }
    /**
     * Fetches a credix pass
     * @param borrower Public key for which we fetch a credix pass
     * @returns
     */
    fetchCredixPass(borrower) {
        return __awaiter(this, void 0, void 0, function* () {
            const [passAddress] = yield __1.CredixPass.generatePDA(borrower, this);
            const pass = yield this.program.account.credixPass.fetchNullable(passAddress);
            if (!pass) {
                return pass;
            }
            return new __1.CredixPass(pass, passAddress);
        });
    }
    /**
     * Generate a market PDA address
     * @param marketName
     * @param programId
     * @returns
     */
    static generatePDA(marketName, programId) {
        const seed = (0, pda_utils_1.encodeSeedString)(marketName);
        return web3_js_1.PublicKey.findProgramAddress([seed], programId);
    }
    // TODO: add pda generation tests with static, know, reference addresses
    generateCredixPassPDA(pk) {
        const credixSeed = (0, pda_utils_1.encodeSeedString)("credix-pass");
        const seed = [this.address.toBuffer(), pk.toBuffer(), credixSeed];
        return web3_js_1.PublicKey.findProgramAddress(seed, this.programId);
    }
    /**
     * Generate the signing authority PDA address for this market
     * @returns
     */
    generateSigningAuthorityPDA() {
        const seed = [this.address.toBuffer()];
        return web3_js_1.PublicKey.findProgramAddress(seed, this.programId);
    }
    /**
     * Calculates the associated token account address for the liquidity pool
     * @returns
     */
    findLiquidityPoolTokenAccount() {
        return __awaiter(this, void 0, void 0, function* () {
            const [signingAuthorityPK] = yield this.generateSigningAuthorityPDA();
            return this.findBaseTokenAccount(signingAuthorityPK);
        });
    }
    /**
     * Calculates the stake of a user expressed in base
     * @param user Public key for which we check the stake
     * @returns
     */
    getUserStake(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const lpPrice = yield this.getLPPrice();
            const userLpTokenAmount = yield this.userLPBalance(user);
            const userLpTokenAmountBig = new big_js_1.default(userLpTokenAmount.amount);
            return userLpTokenAmountBig.mul(lpPrice);
        });
    }
    /**
     * Issue a credix pass. This function requires that the client wallet to belong to a management address
     * @param pk Public key for which we issue a credix pass
     * @param underwriter Enable underwriter functionality.
     * @param borrower Enable borrower functionality (creation of deals)
     * @returns
     */
    issueCredixPass(pk, underwriter, borrower) {
        return __awaiter(this, void 0, void 0, function* () {
            const [credixPassAddress, credixPassBump] = yield __1.CredixPass.generatePDA(pk, this);
            return this.program.rpc.createCredixPass(credixPassBump, underwriter, borrower, {
                accounts: {
                    owner: this.program.provider.wallet.publicKey,
                    passHolder: pk,
                    credixPass: credixPassAddress,
                    systemProgram: web3_js_1.SystemProgram.programId,
                    rent: web3_js_1.SYSVAR_RENT_PUBKEY,
                    globalMarketState: this.address,
                },
            });
        });
    }
    /**
     * Update a credix pass. This function requires that the client wallet to belong to a management address
     * @param pk Public key for which we issue a credix pass
     * @param underwriter Enable underwriter functionality.
     * @param borrower Enable borrower functionality (creation of deals)
     * @returns
     */
    updateCredixPass(pk, active, underwriter, borrower) {
        return __awaiter(this, void 0, void 0, function* () {
            const [credixPassAddress] = yield __1.CredixPass.generatePDA(pk, this);
            return this.program.rpc.updateCredixPass(active, underwriter, borrower, {
                accounts: {
                    owner: this.program.provider.wallet.publicKey,
                    passHolder: pk,
                    credixPass: credixPassAddress,
                    globalMarketState: this.address,
                },
            });
        });
    }
}
exports.Market = Market;
//# sourceMappingURL=Market.js.map