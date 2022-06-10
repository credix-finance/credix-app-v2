import { DealWithNestedResources } from "@state/dealSlice";
import { useCallback, useEffect, useState } from "react";

export const useActiveDeals = (deals: DealWithNestedResources[]) => {
	const [activeDeals, setActiveDeals] = useState<DealWithNestedResources[]>();

	const getActiveDeals = useCallback(async () => {
		if (!deals) {
			return;
		}

		const mappedDeals = await Promise.all(
			deals.map((deal) => {
				return deal.isInProgress(deal.repaymentSchedule);
			})
		);
		const activeDeals = deals.filter((_deal, index) => mappedDeals[index]);

		setActiveDeals(activeDeals);
	}, [deals]);

	useEffect(() => {
		getActiveDeals();
	}, [getActiveDeals]);

	return activeDeals;
};
