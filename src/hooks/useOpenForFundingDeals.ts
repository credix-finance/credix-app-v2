import { DealWithNestedResources } from "@state/dealSlice";
import { asyncFilter } from "@utils/async.utils";
import { useCallback, useEffect, useState } from "react";

export const useOpenForFundingDeals = (deals: DealWithNestedResources[]) => {
	const [openDeals, setOpenDeals] = useState<DealWithNestedResources[]>();

	const getOpenDeals = useCallback(async () => {
		if (!deals) {
			return;
		}

		const openDeals = await asyncFilter(deals, (deal) =>
			deal.isOpenForFunding(deal.repaymentSchedule)
		);

		setOpenDeals(openDeals);
	}, [deals]);

	useEffect(() => {
		getOpenDeals();
	}, [getOpenDeals]);

	return openDeals;
};
