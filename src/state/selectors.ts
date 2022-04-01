import { Deal } from "@credix/credix-client";
import { StoreState } from "@state/useStore";

export const selectPendingDeals = (state: StoreState): Deal[] =>
	state.deals?.filter((deal) => deal.isPending());

export const selectActiveDeals = (state: StoreState): Deal[] =>
	state.deals?.filter((deal) => deal.isInProgress());

export const selectEndedDeals = (state: StoreState): Deal[] =>
	state.deals?.filter((deal) => deal.isClosed());
