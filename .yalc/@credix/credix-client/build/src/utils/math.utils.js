"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZERO = exports.MILLISECONDS_IN_DAY = exports.SECONDS_IN_DAY = void 0;
const big_js_1 = __importDefault(require("big.js"));
exports.SECONDS_IN_DAY = 86400;
exports.MILLISECONDS_IN_DAY = exports.SECONDS_IN_DAY * 1000;
exports.ZERO = new big_js_1.default(0);
//# sourceMappingURL=math.utils.js.map