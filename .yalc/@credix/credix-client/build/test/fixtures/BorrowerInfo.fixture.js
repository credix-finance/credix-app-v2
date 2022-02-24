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
exports.programBorrowerInfoFixture = exports.borrowerInfoFixture = void 0;
const web3_js_1 = require("@solana/web3.js");
const util_1 = require("../util");
exports.borrowerInfoFixture = {
    numOfDeals: 0,
    bump: 0,
};
const programBorrowerInfoFixture = (borrowerInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield util_1.testProgram.coder.accounts.encode("borrowerInfo", borrowerInfo);
    return {
        data: data,
        executable: false,
        lamports: 3173760,
        owner: new web3_js_1.PublicKey("CRDx2YkdtYtGZXGHZ59wNv1EwKHQndnRc1gT4p8i2vPX"),
        rentEpoch: 0,
    };
});
exports.programBorrowerInfoFixture = programBorrowerInfoFixture;
//# sourceMappingURL=BorrowerInfo.fixture.js.map