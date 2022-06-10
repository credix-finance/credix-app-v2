import { DealWithNestedResources } from "@state/dealSlice";
import { useCallback, useEffect, useState } from "react";

export const usePendingDeals = (deals: DealWithNestedResources[]) => {
	const [pendingDeals, setPendingDeals] = useState<DealWithNestedResources[]>();

	const getPendingDeals = useCallback(async () => {
		if (!deals) {
			return;
		}

		const mappedDeals = await Promise.all(
			deals.map((deal) => {
				return deal.isPending(deal.repaymentSchedule);
			})
		);
		const pendingDeals = deals.filter((_deal, index) => mappedDeals[index]);

		setPendingDeals(pendingDeals);
	}, [deals]);

	useEffect(() => {
		getPendingDeals();
	}, [getPendingDeals]);

	return pendingDeals;
};
