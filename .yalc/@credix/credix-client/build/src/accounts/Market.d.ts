import { web3 } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import Big from "big.js";
import { BorrowerInfo, CredixClient, CredixPass, Deal, Ratio } from "..";
import { CredixPassConfig } from "../config";
import { CredixProgram, GlobalMarketState } from "../idl/idl.types";
/**
 * Represents a Credix market. Main entrypoint for market interactions
 */
export declare class Market {
    /**
     * Name of the market
     */
    name: string;
    /**
     * Address of the market
     */
    address: PublicKey;
    private program;
    private programVersion;
    private client;
    /**
     * @ignore
     */
    constructor(market: GlobalMarketState, name: string, program: CredixProgram, address: PublicKey, client: CredixClient);
    /**
     * Deposit into the market's liquidity pool
     * @param amount Amount to deposit
     * @returns promise with the transaction signature
     */
    deposit(amount: number): Promise<string>;
    /**
     * Withdraw from the market's liquidity pool
     * @param amount to withdraw
     * @returns promise with the transaction signature
     */
    withdraw(amount: number): Promise<string>;
    /**
     * Create a deal for this market
     * @param principal Principal of the deal
     * @param financingFee Financing fee of the deal. This is the annualized interest rate that needs to be repaid on top of the principal
     * @param timeToMaturity Time until the principal has to be repaid. Should be a multiple of 30.
     * @param borrower Borrower for which we create the deal.
     * @param dealName Name of the deal.
     * @returns promise with the transaction signature
     */
    createDeal(principal: number, financingFee: number, timeToMaturity: number, borrower: PublicKey, dealName: string): Promise<string>;
    /**
     * Address of the program to which this market belongs
     */
    get programId(): web3.PublicKey;
    /**
     * Address of the base mint for this market. Base tokens are the currency deals are created for (e.g. USDC)
     */
    get baseMintPK(): web3.PublicKey;
    /**
     * Address of the mint of LP token.
     */
    get lpMintPK(): web3.PublicKey;
    /**
     * Address of the treasury of this market
     */
    get treasury(): web3.PublicKey;
    /**
     * Withdrawal fee for this market
     */
    get withdrawFee(): Ratio;
    /**
     * Interest repayment fee for this market. This is taken from the repayments, not added on top.
     */
    get interestFee(): {
        numerator: number;
        denominator: number;
    };
    /**
     * @returns current supply of LP tokens for the lp mint this market uses
     */
    getLPSupply(): Promise<web3.TokenAmount>;
    /**
     * @returns current price of base in LP
     */
    getLPPrice(): Promise<number>;
    /**
     * @returns current price of lp in base
     */
    getBasePrice(): Promise<number>;
    /**
     * @param pk Public key to find the associated token account for
     * @returns an associated token address for the base mint
     */
    findBaseTokenAccount(pk: PublicKey): Promise<web3.PublicKey>;
    /**
     * @param pk Public key to find the associated token account for
     * @returns an associated token address for the lp mint
     */
    findLPTokenAccount(pk: PublicKey): Promise<web3.PublicKey>;
    /**
     * @param user Public key for which we find the base balance
     * @returns the amount of 'base' the user has
     */
    userBaseBalance(user: PublicKey): Promise<web3.TokenAmount>;
    /**
     * @param user Public key for which we find the LP amount
     * @returns the amount of LP the user has
     */
    userLPBalance(user: PublicKey): Promise<web3.TokenAmount>;
    /**
     * @returns the amount of base in the liquidity pool
     */
    fetchLiquidityPoolBalance(): Promise<web3.TokenAmount>;
    /**
     * Gets how much principal is currently being lend out in deals
     */
    get totalOutstandingCredit(): number;
    /**
     * The gatekeeper network this market uses for identity identification
     */
    get gateKeeperNetwork(): web3.PublicKey;
    /**
     * @param borrower Borrower to which the deal belongs
     * @param dealNumber The id of the deal, scoped to the borrower
     * @returns a Deal instance or null if the deal doesn't exist
     */
    fetchDeal(borrower: PublicKey, dealNumber: number): Promise<Deal | null>;
    /**
     * Calculates the weighted average financing fee
     * @returns
     */
    calculateWeightedAverageFinancingFee(): Promise<Ratio>;
    /**
     * Calculates the total value locked of the market (liquidity pool balance + total outstanding credit)
     * @returns
     */
    calculateTVL(): Promise<number>;
    /**
     * Fetches all the deals that belong to this market
     * @returns
     */
    fetchDeals(): Promise<Deal[]>;
    /**
     * Fetches the account containing borrower info for this market
     * @param borrower
     * @returns
     */
    fetchBorrowerInfo(borrower: PublicKey): Promise<BorrowerInfo | null>;
    /**
     * Fetches a credix pass
     * @param borrower Public key for which we fetch a credix pass
     * @returns
     */
    fetchCredixPass(borrower: PublicKey): Promise<CredixPass | null>;
    /**
     * Generate a market PDA address
     * @param marketName
     * @param programId
     * @returns
     */
    static generatePDA(marketName: string, programId: PublicKey): Promise<[web3.PublicKey, number]>;
    /**
     * @param marketName
     * @param programId
     * @returns the lp token mint address that would belong to a market with a certain name
     */
    static generateLPTokenMintPDA(marketName: string, programId: PublicKey): Promise<[web3.PublicKey, number]>;
    private generateCredixPassPDA;
    /**
     * Generate the signing authority PDA address for this market
     * @returns
     */
    generateSigningAuthorityPDA(): Promise<[web3.PublicKey, number]>;
    /**
     * Calculates the associated token account address for the liquidity pool
     * @returns
     */
    findLiquidityPoolTokenAccount(): Promise<web3.PublicKey>;
    /**
     * Calculates the stake of a user expressed in base
     * @param user Public key for which we check the stake
     * @returns
     */
    getUserStake(user: PublicKey): Promise<Big>;
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
    issueCredixPass(pk: PublicKey, credixPassConfig: CredixPassConfig): Promise<string>;
    /**
     * Update a credix pass. This function requires that the client wallet belongs to a management address
     * @param pk Public key for which we update a credix pass
     * @param credixPassConfig Configuration of the credix pass. @see {@link CredixPassConfig}
     * @returns a promise with the transaction signature
     */
    updateCredixPass(pk: PublicKey, credixPassConfig: CredixPassConfig): Promise<string>;
    freeze(): Promise<string>;
    thaw(): Promise<string>;
    get isFrozen(): boolean;
}
//# sourceMappingURL=Market.d.ts.map