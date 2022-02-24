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
exports.programMarketFixture = exports.globalMarketFixture = void 0;
const anchor_1 = require("@project-serum/anchor");
const web3_js_1 = require("@solana/web3.js");
const util_1 = require("../util");
exports.globalMarketFixture = {
    gatekeeperNetwork: web3_js_1.Keypair.generate().publicKey,
    liquidityPoolTokenMintAccount: web3_js_1.Keypair.generate().publicKey,
    lpTokenMintAccount: web3_js_1.Keypair.generate().publicKey,
    treasuryPoolTokenAccount: web3_js_1.Keypair.generate().publicKey,
    totalOutstandingCredit: new anchor_1.BN(10),
    signingAuthorityBump: 255,
    bump: 252,
    interestFee: { numerator: 10, denominator: 100 },
    withdrawalFee: { numerator: 5, denominator: 1000 },
    frozen: false,
};
const programMarketFixture = (market) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield util_1.testProgram.coder.accounts.encode("globalMarketState", market);
    return {
        data: data,
        executable: false,
        lamports: 3173760,
        owner: web3_js_1.Keypair.generate().publicKey,
        rentEpoch: 0,
    };
});
exports.programMarketFixture = programMarketFixture;
//# sourceMappingURL=Market.fixture.js.map