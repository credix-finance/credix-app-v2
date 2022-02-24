import Big from "big.js";
import { Ratio as IDLRatio } from "../idl/idl.types";
export declare class Ratio {
    numerator: Big;
    denominator: Big;
    constructor(numerator: number, denominator: number);
    apply(to: Big): Big;
    /**
     * Helper function to convert this into something that is understandable program side
     * @returns
     */
    toIDLRatio(): IDLRatio;
}
//# sourceMappingURL=Ratio.d.ts.map