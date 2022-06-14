import { DealWithNestedResources } from "@state/dealSlice";
import { asyncFilter } from "@utils/async.utils";
import { useCallback, useEffect, useState } from "react";

export const usePendingDeals = (deals: DealWithNestedResources[]) => {
	const [pendingDeals, setPendingDeals] = useState<DealWithNestedResources[]>();

	const getPendingDeals = useCallback(async () => {
		if (!deals) {
			return;
		}

		const pendingDeals = await asyncFilter(deals, (deal) => deal.isPending(deal.repaymentSchedule));

		setPendingDeals(pendingDeals);
	}, [deals]);

	useEffect(() => {
		getPendingDeals();
	}, [getPendingDeals]);

	return pendingDeals;
};
