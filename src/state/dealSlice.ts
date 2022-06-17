import { GetState, SetState } from "zustand";
import { CredixClient, Deal, Market, RepaymentSchedule, Tranches } from "@credix/credix-client";
import { StoreSlice } from "./useStore";

export interface DealWithNestedResources extends Deal {
	repaymentSchedule: RepaymentSchedule;
	tranches: Tranches;
}

export type DealSlice = {
	deals?: DealWithNestedResources[];
	isLoadingDeals: boolean;
	maybeFetchDeals: (client: CredixClient, market: Market) => Promise<void>;
	getDeal: (
		client: CredixClient,
		market: Market,
		dealAddress: string
	) => Promise<DealWithNestedResources | null>;
};

const getDeals = async (client: CredixClient, market: Market, set: SetState<DealSlice>) => {
	if (!market) {
		return;
	}

	set({ isLoadingDeals: true });
	const deals = (await market.fetchDeals()) as DealWithNestedResources[];

	const repaymentSchedules = await client.repaymentScheduleLoader.fetchForDeals(deals);
	const tranches = await client.tranchesLoader.fetchForDeals(deals);

	const dealsWithNestedResources = deals
		.map((deal, index) => {
			const repaymentSchedule = repaymentSchedules[index];
			if (repaymentSchedule) {
				deal.repaymentSchedule = repaymentSchedule;
			}

			const dealTranches = tranches[index];
			if (dealTranches) {
				deal.tranches = dealTranches;
			}

			return deal;
		})
		.filter((d) => d.tranches && d.repaymentSchedule);

	set({ deals: dealsWithNestedResources, isLoadingDeals: false });
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
	deals: undefined,
	isLoadingDeals: false,
	maybeFetchDeals: (client, market) => maybeGetDeals(client, market, get, set),
	getDeal: async (client, market, dealAddress) => {
		await getDeals(client, market, set);
		const deals = get().deals;

		if (!deals) {
			return null;
		}

		return deals.find((d) => d.address.toString() === dealAddress) || null;
	},
});
