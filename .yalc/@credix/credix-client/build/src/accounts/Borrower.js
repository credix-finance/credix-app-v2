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
exports.BorrowerInfo = void 0;
const web3_js_1 = require("@solana/web3.js");
const pda_utils_1 = require("../utils/pda.utils");
/**
 * Information about a borrower
 */
class BorrowerInfo {
    /**
     * @ignore
     */
    constructor(borrowerInfo, market, address, borrower, client) {
        this.programVersion = borrowerInfo;
        this.market = market;
        this.address = address;
        this.borrower = borrower;
        this.client = client;
    }
    /**
     * Get number of deals
     */
    get numberOfDeals() {
        return this.programVersion.numOfDeals;
    }
    /**
     * Fetch a deal for the borrower
     * @param dealNumber
     * @returns
     */
    fetchDeal(dealNumber) {
        return this.market.fetchDeal(this.borrower, dealNumber);
    }
    /**
     * Fetch all deals for borrower
     * @returns
     */
    fetchDeals() {
        return __awaiter(this, void 0, void 0, function* () {
            const deals = yield this.market.fetchDeals();
            return deals.filter((d) => d.borrower.equals(this.borrower));
        });
    }
    /**
     * Fetch credix pass for borrower
     * @returns
     */
    fetchCredixPass() {
        return this.market.fetchCredixPass(this.address);
    }
    /**
     * Get the civic token for this borrower
     * @returns
     */
    getGatewayToken() {
        return this.client.getGatewayToken(this.borrower, this.market.gateKeeperNetwork);
    }
    /**
     * Generator borrower info PDA
     * @param borrower Borrower to generate the PDA for
     * @param market Market to generate the PDA for
     * @returns
     */
    static generatePDA(borrower, market) {
        const borrowerSeed = (0, pda_utils_1.encodeSeedString)("borrower-info");
        const seeds = [market.address.toBuffer(), borrower.toBuffer(), borrowerSeed];
        return web3_js_1.PublicKey.findProgramAddress(seeds, market.programId);
    }
}
exports.BorrowerInfo = BorrowerInfo;
//# sourceMappingURL=Borrower.js.map