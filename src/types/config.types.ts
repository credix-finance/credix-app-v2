import { ConfirmOptions, PublicKey } from "@solana/web3.js";
import { SyndicaRpcEndpoint, RPCEndpoint, SolanaCluster } from "./solana.types";

export interface ClusterConfig {
	name: SolanaCluster;
	RPCEndpoint: RPCEndpoint | SyndicaRpcEndpoint;
	programId: PublicKey;
	gatewayProgramId: PublicKey;
}

export interface Config {
	clusterConfig: ClusterConfig;
	confirmOptions: ConfirmOptions;
	managementKeys: Array<string>;
}
