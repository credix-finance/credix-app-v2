import React, { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { GatewayProvider } from "@civic/solana-gateway-react";
import { CivicButton } from "@components/CivicButton";
import { config } from "../config";
import { useCredixClient } from "@credix/credix-client";
import { SolanaCluster } from "@credix_types/solana.types";
import { useStore } from "@state/useStore";
import { useRouter } from "next/router";

export const IdentityButton = () => {
	const router = useRouter();
	const { marketplace } = router.query;
	const wallet = useWallet();
	const { publicKey } = wallet;
	const client = useCredixClient();
	const [gatekeeperNetwork, setGatekeeperNetwork] = useState<PublicKey>();
	const maybeFetchMarket = useStore((state) => state.maybeFetchMarket);
	const market = useStore((state) => state.market);

	useEffect(() => {
		maybeFetchMarket(client, marketplace as string);
	}, [client, maybeFetchMarket, marketplace]);

	useEffect(() => {
		if (publicKey && market) {
			setGatekeeperNetwork(market?.gateKeeperNetwork);
		}
	}, [market, publicKey]);

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
