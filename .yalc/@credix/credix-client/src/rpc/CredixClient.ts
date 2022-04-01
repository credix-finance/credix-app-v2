import { findGatewayToken } from "@identity.com/solana-gateway-ts";
import { Provider, Wallet } from "@project-serum/anchor";
import { makeSaberProvider, newProgram } from "@saberhq/anchor-contrib";
import { ASSOCIATED_TOKEN_PROGRAM_ID, Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Connection, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { Market } from "..";
import { CredixClientConfig, MarketConfig } from "../config";
import { IDL } from "../idl/credix";
import { CredixProgram } from "../idl/idl.types";
import { findSigningAuthorityPDA } from "../utils/pda.utils";

/**
 * Client for interacting with Credix programs
 */
export class CredixClient {
	private program: CredixProgram;

	/**
	 * @param connection The connection to be used by the client
	 * @param wallet The wallet to be used by the client
	 * @param config Configuration of the client.
	 * If no confirm options are present the client will use the default options from the connection
	 * @constructor
	 */
	constructor(connection: Connection, wallet: Wallet, config: CredixClientConfig) {
		const provider = new Provider(
			connection,
			wallet,
			config.confirmOptions || Provider.defaultOptions()
		);
		const saberProvider = makeSaberProvider(provider);
		this.program = newProgram<CredixProgram>(IDL, config.programId, saberProvider);
	}

	// TODO: add as static method on Market
	async initializeMarket(marketConfiguration: MarketConfig) {
		const [marketAddress] = await Market.generatePDA(
			marketConfiguration.name,
			this.program.programId
		);

		const [signingAuthority] = await findSigningAuthorityPDA(marketAddress, this.program.programId);

		const liquidityPoolTokenAccount = await Token.getAssociatedTokenAddress(
			ASSOCIATED_TOKEN_PROGRAM_ID,
			TOKEN_PROGRAM_ID,
			marketConfiguration.baseMint,
			signingAuthority,
			true
		);

		const treasuryTokenAccount = await Token.getAssociatedTokenAddress(
			ASSOCIATED_TOKEN_PROGRAM_ID,
			TOKEN_PROGRAM_ID,
			marketConfiguration.baseMint,
			marketConfiguration.treasury,
			true
		);

		const [lpTokenMintAddress] = await Market.generateLPTokenMintPDA(
			marketConfiguration.name,
			this.program.programId
		);

		return this.program.rpc.initializeMarket(
			marketConfiguration.name,
			marketConfiguration.interestFee.toIDLRatio(),
			marketConfiguration.withdrawalFee.toIDLRatio(),
			{
				accounts: {
					owner: this.program.provider.wallet.publicKey,
					gatekeeperNetwork: marketConfiguration.gatekeeperNetwork,
					globalMarketState: marketAddress,
					signingAuthority: signingAuthority,
					liquidityPoolTokenAccount: liquidityPoolTokenAccount,
					treasury: marketConfiguration.treasury,
					treasuryPoolTokenAccount: treasuryTokenAccount,
					lpTokenMint: lpTokenMintAddress,
					baseTokenMint: marketConfiguration.baseMint,
					rent: SYSVAR_RENT_PUBKEY,
					tokenProgram: TOKEN_PROGRAM_ID,
					systemProgram: SystemProgram.programId,
					associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
				},
				signers: [],
			}
		);
	}

	/**
	 * Fetches a market. This market is the main entrypoint for the Credix market program.
	 * @param marketName Name of the market to fetch
	 * @returns
	 */
	async fetchMarket(marketName: string): Promise<Market | null> {
		const [address] = await Market.generatePDA(marketName, this.program.programId);
		const globalMarketState = await this.program.account.globalMarketState.fetchNullable(address);

		if (!globalMarketState) {
			return null;
		}

		return new Market(globalMarketState, marketName, this.program, address, this);
	}

	/**
	 * Fetches the cluster time. This time is equal to the time of the latest block with the commitment level of the client.
	 * @param useFallback Use system time as fallback when cluster time cannot be retrieved
	 * @returns
	 */
	// TODO: use this where necessary
	async getClusterTime(useFallback?: boolean) {
		const slot = await this.program.provider.connection.getSlot();
		const clusterTime = await this.program.provider.connection.getBlockTime(slot);

		if (!clusterTime && useFallback) {
			return Date.now() * 1000;
		}

		return clusterTime;
	}

	/**
	 * Fetches a Civic token. See [Civic]{@link https://docs.civic.com/} and [Identity.com]{@link https://www.identity.com/} documentation to learn what a gatekeeper network is.
	 * @param user Public key to fetch the token for
	 * @param gatekeeperNetwork Gatekeeper Network to which the token should belong
	 * @returns
	 */
	getGatewayToken(user: PublicKey, gatekeeperNetwork: PublicKey) {
		return findGatewayToken(this.program.provider.connection, user, gatekeeperNetwork);
	}
}
