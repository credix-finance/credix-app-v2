"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CredixPass = void 0;
const web3_js_1 = require("@solana/web3.js");
const pda_utils_1 = require("../utils/pda.utils");
class CredixPass {
    constructor(credixPass, address) {
        this.programVersion = credixPass;
        this.address = address;
    }
    get isBorrower() {
        return this.programVersion.isBorrower;
    }
    get isUnderwriter() {
        return this.programVersion.isUnderwriter;
    }
    get isActive() {
        return this.programVersion.active;
    }
    static generatePDA(pk, market) {
        const credixPassSeed = (0, pda_utils_1.encodeSeedString)("credix-pass");
        const seeds = [market.address.toBuffer(), pk.toBuffer(), credixPassSeed];
        return web3_js_1.PublicKey.findProgramAddress(seeds, market.programId);
    }
}
exports.CredixPass = CredixPass;
//# sourceMappingURL=CredixPass.js.map