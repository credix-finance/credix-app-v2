import { ConfirmOptions, PublicKey } from "@solana/web3.js";
import { ClusterConfig, Config } from "@credix_types/config.types";
import { RPCEndpoint, SolanaCluster } from "@credix_types/solana.types";

const baseConfig = {
	programId: new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID),
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
	RPCEndpoint: `${RPCEndpoint.MAINNET}/access-token/${process.env.NEXT_PUBLIC_SYNDICA_TOKEN}/rpc/`,
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

// base58 encoded hashed management keys
const getManagementKeys = () => {
	const targetCluster = getTargetClusterFromEnv();

	switch (targetCluster) {
		case SolanaCluster.MAINNET:
			return [
				"tFRVwKFVEp1t7a3uPpxxqpuUUTubFDeftqea3Qk5GR8pC9RHhjz63v9FQoGEkyMLcnvHpDzAbWDYgvifuYB2K6i",
				"3prR2qTzooeAzrZoT7fdNmHCxmJeeNuJ4Ha2ifJTSyCCm9tBiYFqtFT5KNd4d7jQK9yRks5DGtuHQbJQb3FXHkz6",
				"5c98jiV2tMk98xzYAptcUJ646tQPhquUkBq46qXZRbyidewbmUKVk6fvhujaHFSP2xThZQt54VqtNL9cJX5stZ3s",
				"4d8bKejBFXbj81NjNHGtxq4P4biJbndiD196dWZjb87A3vELbXSxmJdfjMkw3hHF3uEGgpKu51BMVw2Zq6RVk2Xa",
			];
		case SolanaCluster.DEVNET:
			return [
				"5itHp25QsXTyreaNBoLMGvF5wm4wJ5c7BfphSpGFJn9CghwCiZMZEJc1z4faP4vZr8oRWETjEJT2QtGwtnjZh5yE",
				"2WzHf9QXhGi2Kficiy3ApLtxULcDBfZYmCXuJc9c2YmJXH2CUeymyVAn2KznRF2rs8BMoRj2x6oZQMJdz7HqG24E",
				"3prR2qTzooeAzrZoT7fdNmHCxmJeeNuJ4Ha2ifJTSyCCm9tBiYFqtFT5KNd4d7jQK9yRks5DGtuHQbJQb3FXHkz6",
				"5c98jiV2tMk98xzYAptcUJ646tQPhquUkBq46qXZRbyidewbmUKVk6fvhujaHFSP2xThZQt54VqtNL9cJX5stZ3s",
				"4d8bKejBFXbj81NjNHGtxq4P4biJbndiD196dWZjb87A3vELbXSxmJdfjMkw3hHF3uEGgpKu51BMVw2Zq6RVk2Xa",
				"3mnKw8yhSskDnQCLMk7eUPxES7YbNRDVPTF6UtG99yrSrKJzBEqPwD7qbt7ELV2p7HcyM3XNRNwa9tFkVXQKDpiQ",
				"3q3HPkzBrQPSQanquLrcTvV3hExVyMiFA3dcv4Vh1ndZzxVprct1qVdqDQVzrchkiFpwsgx7CoiuDG2zoy1BnfYU",
				"JiUUxTD8HLJUvGjap7uxTNtNq2kpg9fDwC6nknRpukmavzgfNy8MJD47tn2QD8bm7YTximbccnAPhqdNBmKX6gM",
			];
		case SolanaCluster.LOCALNET:
		default:
			return [
				"2WzHf9QXhGi2Kficiy3ApLtxULcDBfZYmCXuJc9c2YmJXH2CUeymyVAn2KznRF2rs8BMoRj2x6oZQMJdz7HqG24E",
			];
	}
};

export const config: Config = ((): Config => {
	const clusterConfig = getClusterConfig();
	// TODO: make these configurable with environment variables
	const confirmOptions: ConfirmOptions = {
		commitment: "confirmed",
		preflightCommitment: "processed",
	};
	const MANAGEMENT_KEYS = getManagementKeys();

	return {
		clusterConfig,
		confirmOptions,
		managementKeys: MANAGEMENT_KEYS,
	};
})();
