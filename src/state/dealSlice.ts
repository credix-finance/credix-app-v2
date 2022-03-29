import { GetState, SetState } from "zustand";
import { Deal, Market } from "@credix/credix-client";
import { StoreSlice } from "./useStore";

export type DealSlice = {
	deals?: Deal[];
	isLoadingDeals: boolean;
	maybeFetchDeals: (market: Market) => Promise<void>;
	getDeal: (market: Market, dealAddress: string) => Promise<Deal>;
};

const getDeals = async (market: Market, set: SetState<DealSlice>) => {
	if (!market) {
		return;
	}

	set({ isLoadingDeals: true });
	const deals = await market.fetchDeals();
	set({ deals, isLoadingDeals: false });
};

const maybeGetDeals = async (
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
	deals: null,
	isLoadingDeals: false,
	maybeFetchDeals: (market) => maybeGetDeals(market, get, set),
	getDeal: async (market, dealAddress) => {
		await getDeals(market, set);

		return get().deals.find((d) => d.address.toString() === dealAddress);
	},
});
