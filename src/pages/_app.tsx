import React, { useMemo } from "react";
import { AppProps } from "next/app";
import Head from "next/head";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
	LedgerWalletAdapter,
	PhantomWalletAdapter,
	SlopeWalletAdapter,
	SolflareWalletAdapter,
	TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { config } from "config";
import { MainMenu } from "@components/MainMenu";
import { ClientProvider } from "@components/ClientProvider";

// Use require instead of import since order matters
require("@solana/wallet-adapter-react-ui/styles.css");
require("../styles/antd.less");
require("../styles/globals.css");

const CredixApp: React.FC<AppProps> = ({ Component, pageProps }) => {
	const wallets = useMemo(
		() => [
			new PhantomWalletAdapter(),
			new SlopeWalletAdapter(),
			new SolflareWalletAdapter(),
			new TorusWalletAdapter(),
			new LedgerWalletAdapter(),
		],
		[]
	);

	return (
		<>
			<Head>
				<title>Credix App</title>
				<meta name="description" content="Credix App" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<ConnectionProvider endpoint={config.clusterConfig.RPCEndpoint}>
				<WalletProvider wallets={wallets} autoConnect>
					<WalletModalProvider>
						<ClientProvider>
							<MainMenu />
							<Component {...pageProps} />
						</ClientProvider>
					</WalletModalProvider>
				</WalletProvider>
			</ConnectionProvider>
		</>
	);
};

export default CredixApp;
