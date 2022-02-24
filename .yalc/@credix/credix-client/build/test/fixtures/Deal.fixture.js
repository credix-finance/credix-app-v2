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
exports.programDealFixture = exports.dealFixture = void 0;
const anchor_1 = require("@project-serum/anchor");
const web3_js_1 = require("@solana/web3.js");
const util_1 = require("../util");
exports.dealFixture = {
    name: "name",
    borrower: web3_js_1.Keypair.generate().publicKey,
    principal: new anchor_1.BN(1000000),
    financingFeePercentage: {
        numerator: 5,
        denominator: 100,
    },
    principalAmountRepaid: new anchor_1.BN(0),
    interestAmountRepaid: new anchor_1.BN(0),
    timeToMaturityDays: 60,
    goLiveAt: new anchor_1.BN(Date.now()),
    createdAt: new anchor_1.BN(Date.now() - 60 * 60 * 24),
    leverageRatio: 0,
    underwriterPerformanceFeePercentage: {
        numerator: 5,
        denominator: 100,
    },
    dealNumber: 0,
    bump: 0,
    lateFees: new anchor_1.BN(0),
    lateFeesRepaid: new anchor_1.BN(0),
    private: false,
    defaulted: false,
};
const programDealFixture = (deal) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield util_1.testProgram.coder.accounts.encode("deal", deal);
    return {
        data: data,
        executable: false,
        lamports: 3173760,
        owner: new web3_js_1.PublicKey("CRDx2YkdtYtGZXGHZ59wNv1EwKHQndnRc1gT4p8i2vPX"),
        rentEpoch: 0,
    };
});
exports.programDealFixture = programDealFixture;
//# sourceMappingURL=Deal.fixture.js.map