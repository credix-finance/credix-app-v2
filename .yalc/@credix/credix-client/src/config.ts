import { ConfirmOptions, PublicKey } from "@solana/web3.js";
import { Ratio } from ".";

/** Configuration for a Credix client */
export interface CredixClientConfig {
	/** Program the client will be used for */
	programId: PublicKey;
	/**
	 * Confirm options to be used by the client.
	 */
	confirmOptions?: ConfirmOptions;
}

/** Configuration of new markets */
export interface MarketConfig {
	name: string;
	/**
	 * Treasury fee on interest repayment
	 */
	interestFee: Ratio;
	/**
	 * Treasury fee on liquidity pool withdrawal
	 */
	withdrawalFee: Ratio;
	/**
	 * Civic gatekeeper network to use for KYC/KYB
	 */
	gatekeeperNetwork: PublicKey;
	/**
	 * Base mint used for the pool and deals (e.g. USDC)
	 */
	baseMint: PublicKey;
	/**
	 * Base mint token account that will receive fees
	 */
	treasury: PublicKey;
	lpTokenName: string;
	lpTokenSymbol: string;
}

/**
 * Configuration for Credix passes
 */
export interface CredixPassConfig {
	/**
	 * Allows investing in the pool
	 */
	underwriter: boolean;
	/**
	 * Allows deals to be created for borrowers
	 */
	borrower: boolean;
	/**
	 * Timestamp when funds are released for withdrawal after investing
	 */
	releaseTimestamp: number;
	/**
	 * Whether the Credix pass should be active. Is only applied when updating the Credix pass
	 */
	active?: boolean;
}
