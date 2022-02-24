"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ratio = void 0;
const big_js_1 = __importDefault(require("big.js"));
class Ratio {
    constructor(numerator, denominator) {
        this.numerator = new big_js_1.default(numerator);
        this.denominator = new big_js_1.default(denominator);
    }
    apply(to) {
        return to.mul(this.numerator).div(this.denominator);
    }
    /**
     * Helper function to convert this into something that is understandable program side
     * @returns
     */
    toIDLRatio() {
        return { numerator: this.numerator.toNumber(), denominator: this.denominator.toNumber() };
    }
}
exports.Ratio = Ratio;
//# sourceMappingURL=Ratio.js.map