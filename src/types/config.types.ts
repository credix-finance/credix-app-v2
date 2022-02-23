import { ConfirmOptions, PublicKey } from "@solana/web3.js";
import { CivicStage } from "./civic.types";
import { RPCEndpoint, SolanaCluster } from "./solana.types";

export interface ClusterConfig {
	name: SolanaCluster;
	RPCEndpoint: RPCEndpoint;
	programId: PublicKey;
	gatewayProgramId: PublicKey;
	stage: CivicStage;
}

export interface Config {
	clusterConfig: ClusterConfig;
	confirmOptions: ConfirmOptions;
	managementKeys: Array<string>;
}
