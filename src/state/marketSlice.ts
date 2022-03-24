import { SetState } from "zustand";
import { CredixClient, Market } from "@credix/credix-client";
import { StoreSlice } from "./useStore";

export type MarketSlice = {
	market?: Market;
	isLoadingMarket: boolean;
	fetchMarket: (client: CredixClient, marketPlace: string) => void;
	maybeFetchMarket: (client: CredixClient, marketPlace: string) => void;
};

const getMarket = async (client: CredixClient, marketPlace: string, set: SetState<MarketSlice>) => {
	set({ isLoadingMarket: true });
	const market = await client.fetchMarket(marketPlace);
	set({ market, isLoadingMarket: false });
};

export const createMarketSlice: StoreSlice<MarketSlice> = (set, get) => ({
	market: null,
	isLoadingMarket: false,
	fetchMarket: async (client, marketPlace) => {
		await getMarket(client, marketPlace, set);
	},
	maybeFetchMarket: async (client, marketPlace) => {
		if (get().market || get().isLoadingMarket) {
			return;
		}

		await getMarket(client, marketPlace, set);
	},
});
