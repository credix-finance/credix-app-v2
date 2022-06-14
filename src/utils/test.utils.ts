import { CredixClient, Deal, Market } from "@credix/credix-client";
import { Keypair } from "@solana/web3.js";

export const generateMockClient = (marketplace = "testmarket") => {
	return {
		fetchMarket: async () => {
			return { name: marketplace };
		},
		repaymentScheduleLoader: {
			fetchForDeals: async () => {
				return [];
			},
		},
	} as unknown as CredixClient;
};

export const generateMockMarket = (deals?: Deal[]) => {
	if (!deals) {
		const deal1 = {
			address: Keypair.generate().publicKey,
			isInProgress: () => true,
			isPending: () => false,
			isClosed: () => false,
		};
		const deal2 = {
			address: Keypair.generate().publicKey,
			isInProgress: () => false,
			isPending: () => true,
			isClosed: () => false,
		};
		const deal3 = {
			address: Keypair.generate().publicKey,
			isInProgress: () => false,
			isPending: () => false,
			isClosed: () => true,
		};
		deals = [deal1 as Deal, deal2 as Deal, deal3 as Deal];
	}

	return {
		fetchDeals: async () => {
			return deals;
		},
	} as unknown as Market;
};
