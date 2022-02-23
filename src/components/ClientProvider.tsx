import { CredixClientProvider } from "@credix/credix-client";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { config } from "config";
import React, { FC, ReactNode } from "react";

export const ClientProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const { connection } = useConnection();
	const wallet = useWallet();

	return (
		<CredixClientProvider
			connection={connection}
			wallet={wallet as typeof Wallet}
			config={{ programId: config.clusterConfig.programId, confirmOptions: config.confirmOptions }}
		>
			{children}
		</CredixClientProvider>
	);
};