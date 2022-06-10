import { GetState, SetState } from "zustand";
import { CredixClient, Deal, Market, RepaymentSchedule, Tranches } from "@credix/credix-client";
import { StoreSlice } from "./useStore";

export interface DealWithNestedResources extends Deal {
	repaymentSchedule?: RepaymentSchedule;
	tranches?: Tranches;
}

export type DealSlice = {
	deals?: DealWithNestedResources[];
	isLoadingDeals: boolean;
	maybeFetchDeals: (client: CredixClient, market: Market) => Promise<void>;
	getDeal: (
		client: CredixClient,
		market: Market,
		dealAddress: string
	) => Promise<DealWithNestedResources>;
};

const getDeals = async (client: CredixClient, market: Market, set: SetState<DealSlice>) => {
	if (!market) {
		return;
	}

	set({ isLoadingDeals: true });
	const deals = (await market.fetchDeals()) as DealWithNestedResources[];

	const repaymentSchedules = await client.repaymentScheduleLoader.fetchForDeals(deals);
	const dealsWithRepaymentSchedule = deals.map((deal, index) => {
		deal.repaymentSchedule = repaymentSchedules[index];
		return deal;
	});

	set({ deals: dealsWithRepaymentSchedule, isLoadingDeals: false });
};

const maybeGetDeals = async (
	client: CredixClient,
	market: Market,
	get: GetState<DealSlice>,
	set: SetState<DealSlice>
) => {
	if (get().deals || get().isLoadingDeals) {
		return;
	}

	await getDeals(client, market, set);
};

export const createDealSlice: StoreSlice<DealSlice> = (set, get) => ({
	deals: null,
	isLoadingDeals: false,
	maybeFetchDeals: (client, market) => maybeGetDeals(client, market, get, set),
	getDeal: async (client, market, dealAddress) => {
		await getDeals(client, market, set);

		return get().deals.find((d) => d.address.toString() === dealAddress);
	},
});
