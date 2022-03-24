import { GetState, SetState } from "zustand";
import { Deal, Market } from "@credix/credix-client";
import { StoreSlice } from "./useStore";

const initialDealsState = {
	deals: null,
};

export type DealSlice = {
	deals?: Deal[];
	isLoadingDeals: boolean;
	fetchDeals: (market: Market) => void;
	maybeFetchDeals: (market: Market) => void;
	getDeal: (market: Market, dealAddress: string) => Promise<Deal>;
};

const getDeals = async (market: Market, set: SetState<DealSlice>) => {
	if (!market) {
		return initialDealsState;
	}

	set({ isLoadingDeals: true });
	const deals = await market.fetchDeals();
	set({ deals, isLoadingDeals: false });
};

const maybeFetchDeals = async (
	market: Market,
	get: GetState<DealSlice>,
	set: SetState<DealSlice>
) => {
	if (get().deals || get().isLoadingDeals) {
		return;
	}

	await getDeals(market, set);
};

export const createDealSlice: StoreSlice<DealSlice> = (set, get) => ({
	market: null,
	...initialDealsState,
	isLoadingDeals: false,
	fetchDeals: async (market) => {
		await getDeals(market, set);
	},
	maybeFetchDeals: async (market) => {
		await maybeFetchDeals(market, get, set);
	},
	getDeal: async (market, dealAddress) => {
		await getDeals(market, set);

		return get().deals.find((d) => d.address.toString() === dealAddress);
	},
});
