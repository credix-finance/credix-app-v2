import { StoreState } from "@state/useStore";
import { DealWithNestedResources } from "./dealSlice";

const mapDeals = async (deals: DealWithNestedResources[]) => {
	const x = await Promise.all(
		deals
			.filter((deal) => deal.repaymentschedule)
			.map((deal) => {
				return deal.isPending(deal.repaymentschedule);
			})
	);

	return x;
};

export const selectPendingDeals = (state: StoreState): DealWithNestedResources[] => {
	if (!state.deals) {
		return;
	}

	const mappedDeals = mapDeals(state.deals);
	const pendingDeals = state.deals.filter((_deal, index) => mappedDeals[index]);

	return pendingDeals;
};

export const selectActiveDeals = (state: StoreState): DealWithNestedResources[] =>
	state.deals?.filter((deal) => true || deal.isInProgress(deal.repaymentschedule));

export const selectEndedDeals = (state: StoreState): DealWithNestedResources[] =>
	state.deals?.filter((deal) => true || deal.isClosed(deal.repaymentschedule));
