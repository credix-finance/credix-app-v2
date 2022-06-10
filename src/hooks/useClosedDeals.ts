import { DealWithNestedResources } from "@state/dealSlice";
import { useCallback, useEffect, useState } from "react";

export const useClosedDeals = (deals: DealWithNestedResources[]) => {
	const [closedDeals, setClosedDeals] = useState<DealWithNestedResources[]>();

	const getClosedDeals = useCallback(async () => {
		if (!deals) {
			return;
		}

		const mappedDeals = await Promise.all(
			deals.map((deal) => {
				return deal.isClosed(deal.repaymentSchedule);
			})
		);
		const closedDeals = deals.filter((_deal, index) => mappedDeals[index]);

		setClosedDeals(closedDeals);
	}, [deals]);

	useEffect(() => {
		getClosedDeals();
	}, [getClosedDeals]);

	return closedDeals;
};
