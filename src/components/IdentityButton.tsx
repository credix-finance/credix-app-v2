import React, { useCallback, useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { GatewayProvider } from "@civic/solana-gateway-react";
import { CivicButton } from "@components/CivicButton";
import { config } from "../config";
import { useCredixClient } from "@credix/credix-client";
import { defaultMarketplace } from "../consts";
import { SolanaCluster } from "@credix_types/solana.types";

export const IdentityButton = () => {
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

	const mapClusterNameToStage = (clusterName: SolanaCluster) => {
		switch (clusterName) {
			case SolanaCluster.LOCALNET: {
				return "local";
			}
			case SolanaCluster.DEVNET: {
				return "preprod";
			}
			case SolanaCluster.MAINNET: {
				return "prod";
			}
			default: {
				break;
			}
		}
	};

	return (
		<GatewayProvider
			wallet={wallet}
			stage={mapClusterNameToStage(config.clusterConfig.name)}
			gatekeeperNetwork={gatekeeperNetwork}
			clusterUrl={config.clusterConfig.RPCEndpoint}
		>
			{gatekeeperNetwork && <CivicButton />}
		</GatewayProvider>
	);
};
