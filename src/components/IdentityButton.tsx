import React, { useEffect } from "react";
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
	const client = useCredixClient();
	const maybeFetchMarket = useStore((state) => state.maybeFetchMarket);
	const market = useStore((state) => state.market);

	useEffect(() => {
		maybeFetchMarket(client, marketplace as string);
	}, [client, maybeFetchMarket, marketplace]);

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
			gatekeeperNetwork={market?.gateKeeperNetwork}
			clusterUrl={config.clusterConfig.RPCEndpoint}
		>
			{market?.gateKeeperNetwork && <CivicButton />}
		</GatewayProvider>
	);
};
