import { FC, ReactElement, ReactNode, useMemo } from "react";
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
import { NextPage } from "next"
import { ClientProvider } from "@components/ClientProvider"

// Use require instead of import since order matters
require("@solana/wallet-adapter-react-ui/styles.css");
require("../styles/antd.less");
require("../styles/globals.css");

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const CredixApp: FC<AppProps> = ({ Component, pageProps }: AppPropsWithLayout) => {
	// @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
	// Only the wallets you configure here will be compiled into your application, and only the dependencies
	// of wallets that your users connect to will be loaded
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

	const getLayout = Component.getLayout ?? ((page) => page)
	const layoutComponent = getLayout(<Component {...pageProps} />)

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
							{layoutComponent}
						</ClientProvider>
					</WalletModalProvider>
				</WalletProvider>
			</ConnectionProvider>
		</>
	);
};

export default CredixApp;
