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
exports.programCredixPassFixture = exports.credixPassFixture = void 0;
const web3_js_1 = require("@solana/web3.js");
const util_1 = require("../util");
exports.credixPassFixture = {
    bump: 0,
    isBorrower: true,
    isUnderwriter: true,
    active: true,
};
const programCredixPassFixture = (credixPass) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield util_1.testProgram.coder.accounts.encode("credixPass", credixPass);
    return {
        data: data,
        executable: false,
        lamports: 3173760,
        owner: new web3_js_1.PublicKey("CRDx2YkdtYtGZXGHZ59wNv1EwKHQndnRc1gT4p8i2vPX"),
        rentEpoch: 0,
    };
});
exports.programCredixPassFixture = programCredixPassFixture;
//# sourceMappingURL=CredixPass.fixture.js.map