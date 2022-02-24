import { web3 } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import Big from "big.js";
import { BorrowerInfo, CredixClient, CredixPass, Deal, Ratio } from "..";
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
     * @returns
     */
    deposit(amount: Big): Promise<string>;
    /**
     * Withdraw from the market's liquidity pool
     * @param amount Amount to withdraw
     * @returns
     */
    withdraw(amount: Big): Promise<string>;
    /**
     * Create a deal for this market
     * @param principal Principal of the deal
     * @param financingFee Financing fee of the deal. This is the annualized interest rate that needs to be repaid on top of the principal
     * @param timeToMaturity Time until the principal has to be repaid. Should be a multiple of 30.
     * @param borrower Borrower for which we create the deal.
     * @param dealName Name of the deal.
     * @returns
     */
    createDeal(principal: Big, financingFee: number, timeToMaturity: number, borrower: PublicKey, dealName: string): Promise<string>;
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
    get withdrawFee(): {
        numerator: number;
        denominator: number;
    };
    /**
     * Interest repayment fee for this market. This is taken from the repayments, not added on top.
     */
    get interestFee(): {
        numerator: number;
        denominator: number;
    };
    /**
     * Gets the current supply of LP tokens for the lp mint this market uses
     * @returns
     */
    getLPSupply(): Promise<web3.TokenAmount>;
    /**
     * Gets the current price of LP tokens in base
     * @returns
     */
    getLPPrice(): Promise<Big>;
    /**
     * Calculates the associated token account for the base mint of this market
     * @param pk Public key to find the associated token account for
     * @returns
     */
    findBaseTokenAccount(pk: PublicKey): Promise<web3.PublicKey>;
    /**
     * Calculates the associated token account for the lp mint of this market
     * @param pk Public key to find the associated token account for
     * @returns
     */
    findLPTokenAccount(pk: PublicKey): Promise<web3.PublicKey>;
    /**
     * Gets the amount of 'base' the user has
     * @param user Public key for which we find the base balance
     * @returns
     */
    userBaseBalance(user: PublicKey): Promise<web3.TokenAmount>;
    /**
     * Gets the amount of LP the user has
     * @param user Public key for which we find the LP amount
     * @returns
     */
    userLPBalance(user: PublicKey): Promise<web3.TokenAmount>;
    /**
     * Gets how base is currently in the liquidity pool
     * @returns
     */
    fetchLiquidityPoolBalance(): Promise<web3.TokenAmount>;
    /**
     * Gets how much principal is currently being lend out in deals
     */
    get totalOutstandingCredit(): Big;
    /**
     * The gatekeeper network this market uses for identity identification
     */
    get gateKeeperNetwork(): web3.PublicKey;
    /**
     * Fetches deal data
     * @param borrower Borrower to which the deal belongs
     * @param dealNumber The id of the deal, scoped to the borrower
     * @returns
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
    calculateTVL(): Promise<Big>;
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
     * Issue a credix pass. This function requires that the client wallet to belong to a management address
     * @param pk Public key for which we issue a credix pass
     * @param underwriter Enable underwriter functionality.
     * @param borrower Enable borrower functionality (creation of deals)
     * @returns
     */
    issueCredixPass(pk: PublicKey, underwriter: boolean, borrower: boolean): Promise<string>;
    /**
     * Update a credix pass. This function requires that the client wallet to belong to a management address
     * @param pk Public key for which we issue a credix pass
     * @param underwriter Enable underwriter functionality.
     * @param borrower Enable borrower functionality (creation of deals)
     * @returns
     */
    updateCredixPass(pk: PublicKey, active: boolean, underwriter: boolean, borrower: boolean): Promise<string>;
}
//# sourceMappingURL=Market.d.ts.map