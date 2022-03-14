import { CredixClient, Market } from "@credix/credix-client";
import { StoreSlice } from "./useStore";

export type MarketSlice = {
	market?: Market;
	fetchMarket: (client: CredixClient, marketPlace: string) => void;
	maybeFetchMarket: (client: CredixClient, marketPlace: string) => void;
};

const getMarket = (client: CredixClient, market: string) => {
	return client.fetchMarket(market);
};

export const createMarketSlice: StoreSlice<MarketSlice> = (set, get) => ({
	market: null,
	fetchMarket: async (client, marketPlace) => {
		const market = await getMarket(client, marketPlace);
		set({ market });
	},
	maybeFetchMarket: async (client, marketPlace) => {
		if (get().market) {
			return;
		}

		const market = await getMarket(client, marketPlace);
		set({ market });
	},
});
