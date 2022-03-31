import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Deal, Deal as DealType, useCredixClient } from "@credix/credix-client";
import { useStore } from "@state/useStore";
import { Link } from "@components/Link";
import RepayDealForm, { DEAL_REPAYMENT_TYPE, RepayDealFormInput } from "@components/RepayDealForm";
import { NextPageWithLayout } from "pages/_app";
import Layout from "@components/Layout";
import { numberFormatter, toProgramAmount, toUIAmount } from "@utils/format.utils";
import message from "message";
import Big from "big.js";
import DealAspectGrid from "@components/DealAspectGrid";
import { Icon } from "@components/Icon";

const Repay: NextPageWithLayout = () => {
	const router = useRouter();
	const { marketplace, did } = router.query;
	const client = useCredixClient();
	const getDeal = useStore((state) => state.getDeal);
	const [deal, setDeal] = useState<DealType>();
	const [monthlyRepaymentAmount, setMonthlyRepaymentAmount] = useState<number>();
	const market = useStore((state) => state.market);
	const fetchMarket = useStore((state) => state.fetchMarket);

	const getDealFromStore = useCallback(async () => {
		if (market) {
			const dealFromStore = await getDeal(market, did as string);
			setDeal(dealFromStore);
		}
	}, [market, did, getDeal]);

	const calculateMonthlyRepaymentAmount = (deal: Deal) => {
		if (!deal) {
			return;
		}

		return toUIAmount(
			new Big(deal.totalInterest.toNumber() / (deal.timeToMaturity / 30))
		).toNumber();
	};

	useEffect(() => {
		const amount = calculateMonthlyRepaymentAmount(deal);
		setMonthlyRepaymentAmount(amount);
	}, [deal]);

	useEffect(() => {
		fetchMarket(client, marketplace as string);
	}, [fetchMarket, client, marketplace]);

	useEffect(() => {
		getDealFromStore();
	}, [getDealFromStore]);

	const onSubmit = ({ type, amount }: RepayDealFormInput) => {
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
		const hide = message.loading({ content: `Repaying ${formattedNumber} USDC of interest` });

		try {
			const programAmount = toProgramAmount(new Big(amount));
			await deal.repayInterest(programAmount.toNumber());
			hide();
			message.success({ content: `Successfully payed ${formattedNumber} USDC of interest` });
			getDealFromStore();
		} catch (error) {
			hide();
			message.error({ content: `Failed to pay ${formattedNumber} USDC of interest` });
		}
	};

	const repayPrincipal = async (amount: number) => {
		if (!deal.interestToRepay.eq(0)) {
			message.error({
				content: `Interest needs to be repaid in full before the principal can be repaid.`,
			});
			return;
		}

		const formattedNumber = numberFormatter.format(amount);
		const hide = message.loading({ content: `Repaying ${formattedNumber} USDC of principal` });

		try {
			const programAmount = toProgramAmount(new Big(amount));
			await deal.repayPrincipal(programAmount.toNumber());
			hide();
			message.success({ content: `Successfully payed ${formattedNumber} USDC of principal` });
			getDealFromStore();
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
		<div className="px-4 py-5 md:pt-20 w-full max-w-3xl flex flex-col justify-self-center">
			<Link to={`/${marketplace}/deals`} label="Go back to all deals" icon="chevron-left-square" />
			<div className="text-4xl font-sans pt-3 pb-9">{deal.name}</div>
			<div className="bg-neutral-0 py-10 px-14 space-y-6">
				<div className="flex items-center space-x-5">
					<Icon name="coin-insert" className="w-7 h-7" />
					<div className="uppercase text-2xl font-bold">make repayment</div>
				</div>
				<DealAspectGrid deal={deal} />
				<RepayDealForm
					onSubmit={onSubmit}
					maxInterestRepayment={toUIAmount(deal.interestToRepay).toNumber()}
					maxPrincipalRepayment={toUIAmount(deal.principalToRepay).toNumber()}
					monthlyRepaymentAmount={monthlyRepaymentAmount}
				/>
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
