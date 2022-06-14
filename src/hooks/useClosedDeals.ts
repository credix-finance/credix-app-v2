import { DealWithNestedResources } from "@state/dealSlice";
import { asyncFilter } from "@utils/async.utils";
import { useCallback, useEffect, useState } from "react";

export const useClosedDeals = (deals: DealWithNestedResources[]) => {
	const [closedDeals, setClosedDeals] = useState<DealWithNestedResources[]>();

	const getClosedDeals = useCallback(async () => {
		if (!deals) {
			return;
		}

		const closedDeals = await asyncFilter(deals, (deal) => deal.isClosed(deal.repaymentSchedule));

		setClosedDeals(closedDeals);
	}, [deals]);

	useEffect(() => {
		getClosedDeals();
	}, [getClosedDeals]);

	return closedDeals;
};
