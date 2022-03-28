import Big from "big.js";
import { Ratio as IDLRatio } from "../idl/idl.types";
export declare class Ratio {
    numerator: Big;
    denominator: Big;
    constructor(numerator: number, denominator: number);
    apply(to: number): Big;
    /**
     * Helper function to convert this into something that is understandable program side
     * @returns
     */
    toIDLRatio(): IDLRatio;
    equals(rhs: Ratio): boolean;
    static fromNumber(n: number): Ratio;
}
//# sourceMappingURL=Ratio.d.ts.map