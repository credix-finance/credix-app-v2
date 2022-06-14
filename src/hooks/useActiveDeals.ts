import { DealWithNestedResources } from "@state/dealSlice";
import { asyncFilter } from "@utils/async.utils";
import { useCallback, useEffect, useState } from "react";

export const useActiveDeals = (deals: DealWithNestedResources[]) => {
	const [activeDeals, setActiveDeals] = useState<DealWithNestedResources[]>();

	const getActiveDeals = useCallback(async () => {
		if (!deals) {
			return;
		}

		const activeDeals = await asyncFilter(deals, (deal) => deal.isInProgress());

		setActiveDeals(activeDeals);
	}, [deals]);

	useEffect(() => {
		getActiveDeals();
	}, [getActiveDeals]);

	return activeDeals;
};
