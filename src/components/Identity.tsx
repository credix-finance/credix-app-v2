import React, { useCallback, useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { GatewayProvider } from "@civic/solana-gateway-react";
import { CivicHeaderSection } from "@components/CivicHeaderSection";
import { config } from "../config";
import { useCredixClient } from "@credix/credix-client";
import { defaultMarketplace } from "../consts";

export const Identity = () => {
	const wallet = useWallet();
	const client = useCredixClient();
	const { connection } = useConnection();
	const [gatekeeperNetwork, setGatekeeperNetwork] = useState<PublicKey>();

	const getGatekeeperNetwork = useCallback(async () => {
		const market = await client.fetchMarket(defaultMarketplace);
		setGatekeeperNetwork(market?.gateKeeperNetwork);
	}, [client]);

	useEffect(() => {
		getGatekeeperNetwork();
	}, [getGatekeeperNetwork]);

	useEffect(() => {
		if (wallet?.publicKey && connection) {
			getGatekeeperNetwork();
		}
	}, [connection, wallet, getGatekeeperNetwork]);

	return (
		<GatewayProvider
			wallet={wallet}
			stage={config.clusterConfig.stage}
			gatekeeperNetwork={gatekeeperNetwork}
			clusterUrl={config.clusterConfig.RPCEndpoint}
		>
			{gatekeeperNetwork && <CivicHeaderSection gatekeeperNetwork={gatekeeperNetwork} />}
		</GatewayProvider>
	);
};
