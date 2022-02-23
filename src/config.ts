import { ConfirmOptions, PublicKey } from "@solana/web3.js";
import { ClusterConfig, Config } from "types/config.types";
import { RPCEndpoint, SolanaCluster } from "types/solana.types";

/// PREFILLED CONFIGS
const localnetConfig: ClusterConfig = {
	name: SolanaCluster.LOCALNET,
	RPCEndpoint: RPCEndpoint.LOCALNET,
	programId: new PublicKey("CRDx2YkdtYtGZXGHZ59wNv1EwKHQndnRc1gT4p8i2vPX"),
	gatewayProgramId: new PublicKey("gatem74V238djXdzWnJf94Wo1DcnuGkfijbf3AuBhfs"),
};

const devnetConfig: ClusterConfig = {
	name: SolanaCluster.DEVNET,
	RPCEndpoint: RPCEndpoint.DEVNET,
	programId: new PublicKey("CRDx2YkdtYtGZXGHZ59wNv1EwKHQndnRc1gT4p8i2vPX"),
	gatewayProgramId: new PublicKey("gatem74V238djXdzWnJf94Wo1DcnuGkfijbf3AuBhfs"),
};

const mainnetConfig: ClusterConfig = {
	name: SolanaCluster.MAINNET,
	RPCEndpoint: RPCEndpoint.MAINNET,
	programId: new PublicKey("CRDx2YkdtYtGZXGHZ59wNv1EwKHQndnRc1gT4p8i2vPX"),
	gatewayProgramId: new PublicKey("gatem74V238djXdzWnJf94Wo1DcnuGkfijbf3AuBhfs"),
};
///

const getTargetClusterFromEnv = (): SolanaCluster => {
	const targetCluster = process.env.REACT_APP_CLUSTER;

	if (targetCluster) {
		if (!Object.values(SolanaCluster).some((c) => c === targetCluster)) {
			throw new Error(`Invalid cluster targeted ${targetCluster}`);
		}

		return targetCluster as SolanaCluster;
	}

	return SolanaCluster.LOCALNET;
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
