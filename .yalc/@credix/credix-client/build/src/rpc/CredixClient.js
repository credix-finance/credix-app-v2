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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CredixClient = void 0;
const solana_gateway_ts_1 = require("@identity.com/solana-gateway-ts");
const anchor_1 = require("@project-serum/anchor");
const anchor_contrib_1 = require("@saberhq/anchor-contrib");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const __1 = require("..");
const credix_1 = require("../idl/credix");
const pda_utils_1 = require("../utils/pda.utils");
/**
 * Client for interacting with Credix programs
 */
class CredixClient {
    /**
     * @param connection The connection to be used by the client
     * @param wallet The wallet to be used by the client
     * @param config Configuration of the client.
     * If no confirm options are present the client will use the default options from the connection
     * @constructor
     */
    constructor(connection, wallet, config) {
        const provider = new anchor_1.Provider(connection, wallet, config.confirmOptions || anchor_1.Provider.defaultOptions());
        const saberProvider = (0, anchor_contrib_1.makeSaberProvider)(provider);
        this.program = (0, anchor_contrib_1.newProgram)(credix_1.IDL, config.programId, saberProvider);
    }
    // TODO: add as static method on Market
    initializeMarket(marketConfiguration) {
        return __awaiter(this, void 0, void 0, function* () {
            const [marketAddress] = yield __1.Market.generatePDA(marketConfiguration.name, this.program.programId);
            const [signingAuthority] = yield (0, pda_utils_1.findSigningAuthorityPDA)(marketAddress, this.program.programId);
            const liquidityPoolTokenAccount = yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, marketConfiguration.baseMint, signingAuthority, true);
            const treasuryTokenAccount = yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, marketConfiguration.baseMint, marketConfiguration.treasury, true);
            const [lpTokenMintAddress] = yield __1.Market.generateLPTokenMintPDA(marketConfiguration.name, this.program.programId);
            return this.program.rpc.initializeMarket(marketConfiguration.name, marketConfiguration.interestFee.toIDLRatio(), marketConfiguration.withdrawalFee.toIDLRatio(), {
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
                    rent: web3_js_1.SYSVAR_RENT_PUBKEY,
                    tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                    systemProgram: web3_js_1.SystemProgram.programId,
                    associatedTokenProgram: spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID,
                },
                signers: [],
            });
        });
    }
    /**
     * Fetches a market. This market is the main entrypoint for the Credix market program.
     * @param marketName Name of the market to fetch
     * @returns
     */
    fetchMarket(marketName) {
        return __awaiter(this, void 0, void 0, function* () {
            const [address] = yield __1.Market.generatePDA(marketName, this.program.programId);
            const globalMarketState = yield this.program.account.globalMarketState.fetchNullable(address);
            if (!globalMarketState) {
                return null;
            }
            return new __1.Market(globalMarketState, marketName, this.program, address, this);
        });
    }
    /**
     * Fetches the cluster time. This time is equal to the time of the latest block with the commitment level of the client.
     * @param useFallback Use system time as fallback when cluster time cannot be retrieved
     * @returns
     */
    // TODO: use this where necessary
    getClusterTime(useFallback) {
        return __awaiter(this, void 0, void 0, function* () {
            const slot = yield this.program.provider.connection.getSlot();
            const clusterTime = yield this.program.provider.connection.getBlockTime(slot);
            if (!clusterTime && useFallback) {
                return Date.now() * 1000;
            }
            return clusterTime;
        });
    }
    /**
     * Fetches a Civic token. See [Civic]{@link https://docs.civic.com/} and [Identity.com]{@link https://www.identity.com/} documentation to learn what a gatekeeper network is.
     * @param user Public key to fetch the token for
     * @param gatekeeperNetwork Gatekeeper Network to which the token should belong
     * @returns
     */
    getGatewayToken(user, gatekeeperNetwork) {
        return (0, solana_gateway_ts_1.findGatewayToken)(this.program.provider.connection, user, gatekeeperNetwork);
    }
}
exports.CredixClient = CredixClient;
//# sourceMappingURL=CredixClient.js.map