import { PublicKey } from "@solana/web3.js";
import { CredixClient, Market } from "..";
import { BorrowerInfo as IDLBorrowerInfo } from "../idl/idl.types";
/**
 * Information about a borrower
 */
export declare class BorrowerInfo {
    /**
     * Market this information is relevant for
     */
    market: Market;
    /**
     * Address of the information
     */
    address: PublicKey;
    /**
     * Public key of the borrower this is information for
     */
    borrower: PublicKey;
    private programVersion;
    private client;
    /**
     * @ignore
     */
    constructor(borrowerInfo: IDLBorrowerInfo, market: Market, address: PublicKey, borrower: PublicKey, client: CredixClient);
    /**
     * Get number of deals
     */
    get numberOfDeals(): number;
    /**
     * Fetch a deal for the borrower
     * @param dealNumber
     * @returns
     */
    fetchDeal(dealNumber: number): Promise<import("./Deal").Deal | null>;
    /**
     * Fetch all deals for borrower
     * @returns
     */
    fetchDeals(): Promise<import("./Deal").Deal[]>;
    /**
     * Fetch credix pass for borrower
     * @returns
     */
    fetchCredixPass(): Promise<import("./CredixPass").CredixPass | null>;
    /**
     * Get the civic token for this borrower
     * @returns
     */
    getGatewayToken(): Promise<import("@identity.com/solana-gateway-ts").GatewayToken | null>;
    /**
     * Generator borrower info PDA
     * @param borrower Borrower to generate the PDA for
     * @param market Market to generate the PDA for
     * @returns
     */
    static generatePDA(borrower: PublicKey, market: Market): Promise<[PublicKey, number]>;
}
//# sourceMappingURL=Borrower.d.ts.map