"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ratio = void 0;
const big_js_1 = __importDefault(require("big.js"));
const fraction_js_1 = __importDefault(require("fraction.js"));
class Ratio {
    constructor(numerator, denominator) {
        this.numerator = new big_js_1.default(numerator);
        this.denominator = new big_js_1.default(denominator);
    }
    // TODO: do we want to expose a 'Big' interface or number interface?
    apply(to) {
        return (0, big_js_1.default)(to).mul(this.numerator).div(this.denominator);
    }
    /**
     * Helper function to convert this into something that is understandable program side
     * @returns
     */
    toIDLRatio() {
        return { numerator: this.numerator.toNumber(), denominator: this.denominator.toNumber() };
    }
    // TODO: add tests
    equals(rhs) {
        return this.numerator.mul(rhs.denominator).eq(rhs.numerator.mul(this.denominator));
    }
    // TODO: add tests
    static fromNumber(n) {
        // TODO: can we do this without a dependency?
        const fraction = new fraction_js_1.default(n);
        return new Ratio(fraction.n, fraction.d * 100);
    }
}
exports.Ratio = Ratio;
//# sourceMappingURL=Ratio.js.map