import { GetState, SetState } from "zustand";
import { CredixClient, Deal, DealStatus, Market } from "@credix/credix-client";
import { StoreSlice } from "./useStore";

const initialDealsState = {
	allDeals: null,
	activeDeals: null,
	pendingDeals: null,
	endedDeals: null,
};

export type MarketSlice = {
	market?: Market;
	allDeals?: Deal[];
	activeDeals?: Deal[];
	pendingDeals?: Deal[];
	endedDeals?: Deal[];
	isLoadingDeals: boolean;
	isLoadingMarket: boolean;
	fetchMarket: (client: CredixClient, marketPlace: string) => void;
	maybeFetchMarket: (client: CredixClient, marketPlace: string) => void;
	fetchDeals: (client: CredixClient, marketPlace: string) => void;
	maybeFetchDeals: (client: CredixClient, marketPlace: string) => void;
	getDeal: (client: CredixClient, marketPlace: string, dealAddress: string) => Promise<Deal>;
};

const getMarket = (client: CredixClient, marketPlace: string) => {
	return client.fetchMarket(marketPlace);
};

const getDeals = async (client: CredixClient, marketPlace: string, get: GetState<MarketSlice>) => {
	const market = get().market ? get().market : await getMarket(client, marketPlace);

	if (!market) {
		return initialDealsState;
	}

	const allDeals = await market.fetchDeals();
	const { activeDeals, endedDeals, pendingDeals } = allDeals?.reduce(
		(acc, deal) => {
			switch (deal.status) {
				case DealStatus.IN_PROGRESS:
					acc.activeDeals.push(deal);
					break;
				case DealStatus.CLOSED:
					acc.endedDeals.push(deal);
					break;
				case DealStatus.PENDING:
					acc.pendingDeals.push(deal);
					break;
				default:
					break;
			}

			return acc;
		},
		{ activeDeals: [], endedDeals: [], pendingDeals: [] }
	);

	return { allDeals, activeDeals, endedDeals, pendingDeals };
};

const maybeFetchDeals = async (
	client: CredixClient,
	marketPlace: string,
	get: GetState<MarketSlice>,
	set: SetState<MarketSlice>
) => {
	if (get().allDeals || get().isLoadingDeals) {
		return;
	}

	set({ isLoadingDeals: true });
	const { allDeals, activeDeals, endedDeals, pendingDeals } = await getDeals(
		client,
		marketPlace,
		get
	);
	set({ allDeals, activeDeals, endedDeals, pendingDeals, isLoadingDeals: false });
};

export const createMarketSlice: StoreSlice<MarketSlice> = (set, get) => ({
	market: null,
	...initialDealsState,
	isLoadingDeals: false,
	isLoadingMarket: false,
	fetchMarket: async (client, marketPlace) => {
		set({ isLoadingMarket: true });
		const market = await getMarket(client, marketPlace);
		set({ market, ...initialDealsState, isLoadingMarket: false });
	},
	maybeFetchMarket: async (client, marketPlace) => {
		if (get().market || get().isLoadingMarket) {
			return;
		}

		const market = await getMarket(client, marketPlace);
		set({ market });
	},
	fetchDeals: async (client, marketPlace) => {
		set({ isLoadingDeals: true });
		const { allDeals, activeDeals, endedDeals, pendingDeals } = await getDeals(
			client,
			marketPlace,
			get
		);
		set({ allDeals, activeDeals, endedDeals, pendingDeals, isLoadingDeals: false });
	},
	maybeFetchDeals: async (client, marketPlace) => {
		await maybeFetchDeals(client, marketPlace, get, set);
	},
	getDeal: async (client, marketPlace, dealAddress) => {
		await maybeFetchDeals(client, marketPlace, get, set);

		if (!get().allDeals) {
			return;
		}

		return get().allDeals.find((d) => d.address.toString() === dealAddress);
	},
});
