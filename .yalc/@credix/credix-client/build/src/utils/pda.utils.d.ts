import { PublicKey } from "@solana/web3.js";
export declare const encodeSeedString: (seedString: string) => Buffer;
export declare const findSigningAuthorityPDA: (marketAddress: PublicKey, programId: PublicKey) => Promise<[PublicKey, number]>;
//# sourceMappingURL=pda.utils.d.ts.map