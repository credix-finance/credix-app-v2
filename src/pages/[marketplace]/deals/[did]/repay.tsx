import React, { useCallback, useEffect, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import Big from "big.js";
import { Deal as DealType, useCredixClient } from "@credix/credix-client";
import { useStore } from "@state/useStore";
import { DealDetails } from "@components/DealDetails";
import { Link } from "@components/Link";
import RepayDealForm, { DEAL_REPAYMENT_TYPE, RepayDealFormInput } from "@components/RepayDealForm";

const Deal: NextPage = () => {
	const router = useRouter();
	const { marketplace, did } = router.query;
	const client = useCredixClient();
	const getDeal = useStore((state) => state.getDeal);
	const [deal, setDeal] = useState<DealType>();

	const getDealFromStore = useCallback(async () => {
		const dealFromStore = await getDeal(client, marketplace as string, did as string);
		setDeal(dealFromStore);
	}, [client, marketplace, did, getDeal]);

	const onSubmit = ({ type, amount }: RepayDealFormInput) => {
		const amountBig = new Big(amount);
		switch (type) {
			case DEAL_REPAYMENT_TYPE.INTEREST:
				deal.repayInterest(amountBig);
				// TODO: dispaly success message
				// TODO: reload deal data
				break;
			case DEAL_REPAYMENT_TYPE.PRINCIPAL:
				deal.repayPrincipal(amountBig);
				// TODO: dispaly success message
				// TODO: reload deal data
				break;
			default:
				// TODO: log error we should never get here
				break;
		}
	};

	useEffect(() => {
		getDealFromStore();
	}, [getDealFromStore]);

	if (!deal) {
		return null;
	}

	return (
		<div className="px-4 py-5 md:pt-20 max-w-3xl flex flex-col justify-self-center">
			<Link
				to={`/${marketplace}/my-deals`}
				label="Go back to all deals"
				icon="chevron-left-square"
			/>
			<div className="text-4xl font-sans pt-3 pb-5">{deal?.name}</div>
			<div className="bg-neutral-0 p-12 space-y-7">
				<DealDetails deal={deal} />
				<RepayDealForm onSubmit={onSubmit} />
			</div>
		</div>
	);
};

export default Deal;
