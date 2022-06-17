import { CredixClient, Deal, Market, RepaymentSchedule, Tranches } from "@credix/credix-client";
import { Keypair } from "@solana/web3.js";
import { DealWithNestedResources } from "@state/dealSlice";

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
		tranchesLoader: {
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
			isInProgress: async () => true,
			isPending: async () => false,
			isClosed: async () => false,
			tranches: {} as Tranches,
			repaymentSchedule: {} as RepaymentSchedule,
		};
		const deal2 = {
			address: Keypair.generate().publicKey,
			isInProgress: async () => false,
			isPending: async () => true,
			isClosed: async () => false,
			tranches: {} as Tranches,
			repaymentSchedule: {} as RepaymentSchedule,
		};
		const deal3 = {
			address: Keypair.generate().publicKey,
			isInProgress: async () => false,
			isPending: async () => false,
			isClosed: async () => true,
			tranches: {} as Tranches,
			repaymentSchedule: {} as RepaymentSchedule,
		};
		deals = [
			deal1 as DealWithNestedResources,
			deal2 as DealWithNestedResources,
			deal3 as DealWithNestedResources,
		];
	}

	return {
		fetchDeals: async () => {
			return deals;
		},
	} as unknown as Market;
};
