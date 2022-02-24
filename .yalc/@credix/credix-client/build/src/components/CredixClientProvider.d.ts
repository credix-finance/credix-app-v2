import { Wallet } from "@project-serum/anchor";
import { Connection } from "@solana/web3.js";
import { CredixClientConfig } from "..";
import * as React from "react";
export interface CredixClientProviderProps {
    connection: Connection;
    wallet: typeof Wallet;
    config: CredixClientConfig;
    children: React.ReactNode;
}
export declare const CredixClientProvider: (props: CredixClientProviderProps) => JSX.Element;
//# sourceMappingURL=CredixClientProvider.d.ts.map