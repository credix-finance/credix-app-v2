import { Wallet } from "@project-serum/anchor";
import { ConfirmOptions, Connection, PublicKey } from "@solana/web3.js";
import { Market } from "..";
/** Configuration for a Credix client */
export interface CredixClientConfig {
    /** Program the client will be used for */
    programId: PublicKey;
    /**
     * Confirm options to be used by the client.
     */
    confirmOptions?: ConfirmOptions;
}
/**
 * Client for interacting with Credix programs
 */
export declare class CredixClient {
    private program;
    /**
     * @param connection The connection to be used by the client
     * @param wallet The wallet to be used by the client
     * @param config Configuration of the client.
     * If no confirm options are present the client will use the default options from the connection
     * @constructor
     */
    constructor(connection: Connection, wallet: typeof Wallet, config: CredixClientConfig);
    /**
     * Fetches a market. This market is the main entrypoint for the Credix market program.
     * @param marketName Name of the market to fetch
     * @returns
     */
    fetchMarket(marketName: string): Promise<Market | null>;
    /**
     * Fetches the cluster time. This time is equal to the time of the latest block with the commitment level of the client.
     * @param useFallback Use system time as fallback when cluster time cannot be retrieved
     * @returns
     */
    getClusterTime(useFallback?: boolean): Promise<number | null>;
    /**
     * Fetches a Civic token. See [Civic]{@link https://docs.civic.com/} and [Identity.com]{@link https://www.identity.com/} documentation to learn what a gatekeeper network is.
     * @param user Public key to fetch the token for
     * @param gatekeeperNetwork Gatekeeper Network to which the token should belong
     * @returns
     */
    getGatewayToken(user: PublicKey, gatekeeperNetwork: PublicKey): Promise<import("@identity.com/solana-gateway-ts").GatewayToken | null>;
}
//# sourceMappingURL=CredixClient.d.ts.map