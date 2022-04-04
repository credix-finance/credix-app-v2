import { RPCEndpoint } from "@credix_types/solana.types";
import { CredixClient } from "@credix/credix-client";
import { marketplaces } from "@consts";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import { config } from "../config";
import { Connection, Keypair } from "@solana/web3.js";

const getCredixClient = (endpoint?: RPCEndpoint) => {
	const wallet = new NodeWallet(Keypair.generate());
	const connection = new Connection(
		endpoint || config.clusterConfig.RPCEndpoint,
		config.confirmOptions.commitment
	);
	const clientConfig = {
		programId: config.clusterConfig.programId,
		confirmOptions: config.confirmOptions,
	};
	return new CredixClient(connection, wallet, clientConfig);
};

const getDealsForMarket = async (client: CredixClient, marketplace: string) => {
	const market = await client.fetchMarket(marketplace);
	return await market?.fetchDeals();
};

export interface MarketDealParam {
	params: {
		marketplace: string;
		did: string;
	};
}

export const getMarketDealsPaths = async (endpoint?: RPCEndpoint) => {
	const client = await getCredixClient(endpoint);
	let paths: MarketDealParam[] = [];

	for (const marketplace of marketplaces) {
		const deals = await getDealsForMarket(client, marketplace);

		if (!deals) {
			continue;
		}

		paths = deals.reduce((paths, deal) => {
			return [
				...paths,
				{
					params: {
						marketplace,
						did: deal.address.toString(),
					},
				},
			];
		}, paths);
	}

	return paths;
};

export const getMarketsPaths = () =>
	marketplaces.map((marketplace) => ({ params: { marketplace } }));
