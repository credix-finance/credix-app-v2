/// <reference types="node" />
import { AccountInfo } from "@solana/web3.js";
import { GlobalMarketState } from "../../src/idl/idl.types";
export declare const globalMarketFixture: GlobalMarketState;
export declare const programMarketFixture: (market: GlobalMarketState) => Promise<AccountInfo<Buffer>>;
//# sourceMappingURL=Market.fixture.d.ts.map