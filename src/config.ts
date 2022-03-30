import { ConfirmOptions, PublicKey } from "@solana/web3.js";
import { ClusterConfig, Config } from "@credix_types/config.types";
import { RPCEndpoint, SolanaCluster } from "@credix_types/solana.types";

const baseConfig = {
	programId: new PublicKey("CRDx2YkdtYtGZXGHZ59wNv1EwKHQndnRc1gT4p8i2vPX"),
	gatewayProgramId: new PublicKey("gatem74V238djXdzWnJf94Wo1DcnuGkfijbf3AuBhfs"),
};

/// PREFILLED CONFIGS
const localnetConfig: ClusterConfig = {
	...baseConfig,
	name: SolanaCluster.LOCALNET,
	RPCEndpoint: RPCEndpoint.LOCALNET,
};

const devnetConfig: ClusterConfig = {
	...baseConfig,
	name: SolanaCluster.DEVNET,
	RPCEndpoint: RPCEndpoint.DEVNET,
};

const mainnetConfig: ClusterConfig = {
	...baseConfig,
	name: SolanaCluster.MAINNET,
	RPCEndpoint: RPCEndpoint.MAINNET,
};
///

const getTargetClusterFromEnv = (): SolanaCluster => {
	const targetCluster = process.env.NEXT_PUBLIC_REACT_APP_CLUSTER;

	if (targetCluster) {
		if (!Object.values(SolanaCluster).some((c) => c === targetCluster)) {
			throw new Error(`Invalid cluster targeted ${targetCluster}`);
		}

		return targetCluster as SolanaCluster;
	}

	return SolanaCluster.DEVNET;
};

const getClusterConfig = (): ClusterConfig => {
	const targetCluster = getTargetClusterFromEnv();

	switch (targetCluster) {
		case SolanaCluster.DEVNET:
			return devnetConfig;
		case SolanaCluster.MAINNET:
			return mainnetConfig;
		default:
			return localnetConfig;
	}
};

export const config: Config = ((): Config => {
	const clusterConfig = getClusterConfig();
	// TODO: make these configurable with environment variables
	const confirmOptions: ConfirmOptions = {
		commitment: "confirmed",
		preflightCommitment: "processed",
	};
	const MANAGEMENT_KEYS = [
		"Ej5zJzej7rrUoDngsJ3jcpfuvfVyWpcDcK7uv9cE2LdL",
		"Ej5zJzej7rrUoDngsJ3jcpfuvfVyWpcDcK7uv9cE2LdL",
	];

	return {
		clusterConfig,
		confirmOptions,
		managementKeys: MANAGEMENT_KEYS,
	};
})();
