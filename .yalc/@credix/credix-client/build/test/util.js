"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testProgram = exports.testClient = exports.testConnection = exports.testProgramId = void 0;
const anchor_1 = require("@project-serum/anchor");
const nodewallet_1 = __importDefault(require("@project-serum/anchor/dist/cjs/nodewallet"));
const anchor_contrib_1 = require("@saberhq/anchor-contrib");
const web3_js_1 = require("@solana/web3.js");
const src_1 = require("../src");
const credix_1 = require("../src/idl/credix");
exports.testProgramId = new web3_js_1.PublicKey("CRDx2YkdtYtGZXGHZ59wNv1EwKHQndnRc1gT4p8i2vPX");
const testCredixClientConfig = {
    programId: exports.testProgramId,
    confirmOptions: { commitment: "finalized" },
};
const testWallet = new nodewallet_1.default(web3_js_1.Keypair.generate());
exports.testConnection = new web3_js_1.Connection("http://127.0.0.1:8899");
const testProvider = new anchor_1.Provider(exports.testConnection, testWallet, anchor_1.Provider.defaultOptions());
exports.testClient = new src_1.CredixClient(exports.testConnection, testWallet, testCredixClientConfig);
exports.testProgram = (0, anchor_contrib_1.newProgram)(credix_1.IDL, exports.testProgramId, (0, anchor_contrib_1.makeSaberProvider)(testProvider));
//# sourceMappingURL=util.js.map