export enum SolanaCluster {
	LOCALNET = "localnet",
	DEVNET = "devnet",
	MAINNET = "mainnet-beta",
}

export type SyndicaRpcEndpoint = `${string}/access-token/${string}/rpc/`;
export enum RPCEndpoint {
	LOCALNET = "http://127.0.0.1:8899",
	DEVNET = "https://api.devnet.solana.com",
	MAINNET = "https://solana-api.syndica.io",
}
