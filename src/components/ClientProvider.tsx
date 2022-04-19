import React, { FC, ReactNode } from "react";
import { CredixClientProvider } from "@credix/credix-client";
import { Wallet } from "@project-serum/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { config } from "@config";

export const ClientProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const { connection } = useConnection();
	const wallet = useAnchorWallet();

	return (
		<CredixClientProvider
			connection={connection}
			wallet={wallet as Wallet}
			config={{
				programId: config.clusterConfig.programId,
				confirmOptions: config.confirmOptions,
			}}
		>
			{children}
		</CredixClientProvider>
	);
};
