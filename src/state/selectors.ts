import { DealStatus } from "@credix/credix-client";
import { StoreState } from "@state/useStore";
import { DealWithNestedResources } from "./dealSlice";
import { asyncFilter } from "../utils/async.utils";
import { AsyncSelector } from "@hooks/useAsyncStore";

export const dealStatusSelector =
	(dealState: DealStatus): AsyncSelector<DealWithNestedResources[]> =>
	async (state: StoreState) => {
		if (!state.deals) {
			return [];
		}

		const selectedDeals = await asyncFilter(state.deals, async (d) => {
			const status = await d.status(d.repaymentSchedule);
			return status === dealState;
		});

		return selectedDeals;
	};

export const pendingDealsSelector = dealStatusSelector(DealStatus.PENDING);
export const openForFundingDealsSelector = dealStatusSelector(DealStatus.OPEN_FOR_FUNDING);
export const closedDealsSelector = dealStatusSelector(DealStatus.CLOSED);
export const inProgressDealsSelector = dealStatusSelector(DealStatus.IN_PROGRESS);
export const defaultedDealsSelector = dealStatusSelector(DealStatus.DEFAULTED);

export const loadingDealsSelector = (state: StoreState) => state.isLoadingDeals;
export const isAdminSelector = (state: StoreState) => !!state.isAdmin;
export const marketSelector = (state: StoreState) => state.market;
export const maybeFetchDealsSelector = (state: StoreState) => state.maybeFetchDeals;
export const fetchMarketSelector = (state: StoreState) => state.fetchMarket;
