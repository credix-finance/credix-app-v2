import { GetState, SetState } from "zustand";
import { CredixClient, Market } from "@credix/credix-client";
import { StoreSlice } from "./useStore";

export type MarketSlice = {
	market?: Market;
	isLoadingMarket: boolean;
	fetchMarket: (client: CredixClient, marketPlace: string) => Promise<void>;
	maybeFetchMarket: (client: CredixClient, marketPlace: string) => Promise<void>;
};

const getMarket = async (client: CredixClient, marketPlace: string, set: SetState<MarketSlice>) => {
	set({ isLoadingMarket: true });
	const market = await client.fetchMarket(marketPlace);
	set({ market, isLoadingMarket: false });
};

const maybeGetMarket = async (
	client: CredixClient,
	marketPlace: string,
	set: SetState<MarketSlice>,
	get: GetState<MarketSlice>
) => {
	if (get().market || get().isLoadingMarket) {
		return;
	}

	await getMarket(client, marketPlace, set);
};

export const createMarketSlice: StoreSlice<MarketSlice> = (set, get) => ({
	market: null,
	isLoadingMarket: false,
	fetchMarket: (client, marketPlace) => getMarket(client, marketPlace, set),
	maybeFetchMarket: (client, marketPlace) => maybeGetMarket(client, marketPlace, set, get),
});
