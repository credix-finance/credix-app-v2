"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findSigningAuthorityPDA = exports.encodeSeedString = void 0;
const anchor_1 = require("@project-serum/anchor");
const web3_js_1 = require("@solana/web3.js");
const encodeSeedString = (seedString) => Buffer.from(anchor_1.utils.bytes.utf8.encode(seedString));
exports.encodeSeedString = encodeSeedString;
const findSigningAuthorityPDA = (marketAddress, programId) => {
    const seed = [marketAddress.toBuffer()];
    return web3_js_1.PublicKey.findProgramAddress(seed, programId);
};
exports.findSigningAuthorityPDA = findSigningAuthorityPDA;
//# sourceMappingURL=pda.utils.js.map