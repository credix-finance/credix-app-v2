import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Big from "big.js";
import { Deal as DealType, useCredixClient } from "@credix/credix-client";
import { useStore } from "@state/useStore";
import { DealDetails } from "@components/DealDetails";
import { Link } from "@components/Link";
import RepayDealForm, { DEAL_REPAYMENT_TYPE, RepayDealFormInput } from "@components/RepayDealForm";
import { NextPageWithLayout } from "pages/_app";
import Layout from "@components/Layout";
import { numberFormatter, toUIAmount } from "@utils/format.utils";
import message from "message";

const Repay: NextPageWithLayout = () => {
	const router = useRouter();
	const { marketplace, did } = router.query;
	const client = useCredixClient();
	const getDeal = useStore((state) => state.getDeal);
	const [deal, setDeal] = useState<DealType>();
	const market = useStore((state) => state.market);
	const fetchMarket = useStore((state) => state.fetchMarket);

	const getDealFromStore = useCallback(async () => {
		if (market) {
			const dealFromStore = await getDeal(market, did as string);
			setDeal(dealFromStore);
		}
	}, [market, did, getDeal]);

	useEffect(() => {
		fetchMarket(client, marketplace as string);
	}, [fetchMarket, client, marketplace]);

	useEffect(() => {
		getDealFromStore();
	}, [getDealFromStore]);

	const onSubmit = ({ repayment: { type, amount } }: RepayDealFormInput) => {
		switch (type) {
			case DEAL_REPAYMENT_TYPE.INTEREST:
				repayInterest(amount);
				break;
			case DEAL_REPAYMENT_TYPE.PRINCIPAL:
				repayPrincipal(amount);
				break;
			default:
				break;
		}
	};

	const repayInterest = async (amount: number) => {
		const formattedNumber = numberFormatter.format(amount);
		const amountBig = new Big(amount);
		const hide = message.loading({ content: `Repaying ${formattedNumber} USDC of interest` });

		try {
			await deal.repayInterest(amountBig);
			hide();
			message.success({ content: `Successfully payed ${formattedNumber} USDC of interest` });
			// TODO: refresh deal
		} catch (error) {
			hide();
			console.log(error);
			message.error({ content: `Failed to pay ${formattedNumber} USDC of interest` });
		}
	};

	const repayPrincipal = async (amount: number) => {
		const formattedNumber = numberFormatter.format(amount);
		const amountBig = new Big(amount);
		const hide = message.loading({ content: `Repaying ${formattedNumber} USDC of principal` });

		try {
			await deal.repayPrincipal(amountBig);
			hide();
			message.success({ content: `Successfully payed ${formattedNumber} USDC of principal` });
			// TODO: refresh deal
		} catch (error) {
			hide();
			message.error({ content: `Failed to pay ${formattedNumber} USDC of principal` });
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
			<Link to={`/${marketplace}/deals`} label="Go back to all deals" icon="chevron-left-square" />
			<div className="text-4xl font-sans pt-3 pb-5">{deal?.name}</div>
			<div className="bg-neutral-0 pb-12">
				<DealDetails deal={deal} />
				<div className="px-12">
					<RepayDealForm
						onSubmit={onSubmit}
						maxInterestRepayment={toUIAmount(deal.interestToRepay).toNumber()}
						maxPrincipalRepayment={toUIAmount(deal.principalToRepay).toNumber()}
					/>
				</div>
			</div>
		</div>
	);
};

Repay.getLayout = function getLayout(page: ReactElement) {
	return (
		<Layout.WithSideMenu>
			<Layout.WithMainMenu showLogo={false}>{page}</Layout.WithMainMenu>
		</Layout.WithSideMenu>
	);
};

export default Repay;
