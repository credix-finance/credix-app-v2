import { PublicKey } from "@solana/web3.js";
import { Big } from "big.js";
import { CredixProgram, Deal as ProgramDeal } from "../idl/idl.types";
import { Market } from "./Market";
import { Ratio } from "./Ratio";
import { CredixClient } from "..";
export declare enum DealStatus {
    /**
     * The deal is repaid
     */
    CLOSED = 0,
    /**
     * The deal is active but not yet repaid
     */
    IN_PROGRESS = 1,
    /**
     * The deal has not yet activated. I.e. the borrower hasn't received money yet.
     */
    PENDING = 2
}
/**
 * Deal in a market
 */
export declare class Deal {
    address: PublicKey;
    market: Market;
    private programVersion;
    private program;
    private client;
    /**
     * @ignore
     */
    constructor(deal: ProgramDeal, market: Market, address: PublicKey, program: CredixProgram, client: CredixClient);
    /**
     * Generate a deal PDA
     * @param borrower Borrower of the deal
     * @param dealNumber Number of the deal
     * @param market Market to which the deal belongs
     * @returns
     */
    static generatePDA(borrower: PublicKey, dealNumber: number, market: Market): Promise<[PublicKey, number]>;
    /**
     * Name of the deal
     */
    get name(): string;
    /**
     * Timestamp of deal creation
     */
    get createdAt(): number;
    get leverageRatio(): number;
    /**
     * Fee for the underwriters for underwriting the deal
     */
    get underwriterPerformanceFeePercentage(): Ratio;
    /**
     * Number of the deal
     */
    get number(): number;
    /**
     * Fees accrued by missed payments
     */
    get lateFees(): number;
    get lateFeesRepaid(): number;
    get isPrivate(): boolean;
    get defaulted(): boolean;
    /**
     * How much was lent
     */
    get principal(): number;
    /**
     * How much of the principal was repaid
     */
    get principalAmountRepaid(): number;
    /**
     * The principal that is yet to be repaid
     */
    get principalToRepay(): Big;
    /**
     * How much of the interest was repaid
     */
    get interestRepaid(): number;
    /**
     * Total interest accrued by the deal
     */
    get totalInterest(): Big;
    /**
     * How much interest is yet to be repaid
     */
    get interestToRepay(): Big;
    get financingFeePercentage(): Ratio;
    get timeToMaturity(): number;
    /**
     * When the deal went live. This is the moment where funds are transferred to the borrower
     */
    get goLiveAt(): number | null;
    get status(): DealStatus;
    isPending(): boolean;
    isClosed(): boolean;
    isInProgress(): boolean;
    /**
     * Gets the remaining time before this deal goes into late fees
     */
    get daysRemaining(): number;
    /**
     * Get address of the borrower. This is not borrower info but the actual recipient of the funds
     */
    get borrower(): PublicKey;
    /**
     * Activates this deal
     * @returns
     */
    activate(): Promise<string>;
    /**
     * Repays principal of the deal. This needs to happen after the interest repayments
     * @param amount
     * @returns
     */
    repayPrincipal(amount: number): Promise<string>;
    /**
     * Repays interest of the deal. This needs to happen before principal repayments.
     * @param amount
     * @returns
     */
    repayInterest(amount: number): Promise<string>;
    private repay;
}
//# sourceMappingURL=Deal.d.ts.map