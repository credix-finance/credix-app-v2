import { PublicKey } from "@solana/web3.js";
import { Market } from "..";
import { CredixPass as IDLCredixPass } from "../idl/idl.types";
export declare class CredixPass {
    private programVersion;
    address: PublicKey;
    constructor(credixPass: IDLCredixPass, address: PublicKey);
    get isBorrower(): boolean;
    get isUnderwriter(): boolean;
    get isActive(): boolean;
    static generatePDA(pk: PublicKey, market: Market): Promise<[PublicKey, number]>;
}
//# sourceMappingURL=CredixPass.d.ts.map