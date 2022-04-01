/// <reference types="node" />
import { AccountInfo } from "@solana/web3.js";
import { BorrowerInfo } from "../../src/idl/idl.types";
export declare const borrowerInfoFixture: BorrowerInfo;
export declare const programBorrowerInfoFixture: (borrowerInfo: BorrowerInfo) => Promise<AccountInfo<Buffer>>;
//# sourceMappingURL=BorrowerInfo.fixture.d.ts.map