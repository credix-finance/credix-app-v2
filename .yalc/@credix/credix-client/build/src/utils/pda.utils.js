"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeSeedString = void 0;
const anchor_1 = require("@project-serum/anchor");
const encodeSeedString = (seedString) => Buffer.from(anchor_1.utils.bytes.utf8.encode(seedString));
exports.encodeSeedString = encodeSeedString;
//# sourceMappingURL=pda.utils.js.map