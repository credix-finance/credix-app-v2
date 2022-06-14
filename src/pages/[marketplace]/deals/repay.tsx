import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
	Deal as DealType,
	RepaymentSchedule,
	Tranches,
	useCredixClient,
} from "@credix/credix-client";
import { useStore } from "@state/useStore";
import RepayDealForm, { RepayDealFormInput } from "@components/RepayDealForm";
import { NextPageWithLayout } from "pages/_app";
import Layout from "@components/Layout";
import { compactFormatter, toProgramAmount } from "@utils/format.utils";
import message from "message";
import Big from "big.js";
import DealAspectGrid from "@components/DealAspectGrid";
import { Icon } from "@components/Icon";
import { calculateMonthlyRepaymentAmount } from "@utils/deal.utils";
import { DealCard } from "@components/DealCard";
import { getMarketsPaths } from "@utils/export.utils";
import loadIntlMessages from "@utils/i18n.utils";
import { useIntl } from "react-intl";

const Repay: NextPageWithLayout = () => {
	const router = useRouter();
	const { marketplace, dealId } = router.query;
	const client = useCredixClient();
	const getDeal = useStore((state) => state.getDeal);
	const [deal, setDeal] = useState<DealType>();
	const [monthlyRepaymentAmount, setMonthlyRepaymentAmount] = useState<number>();
	const market = useStore((state) => state.market);
	const fetchMarket = useStore((state) => state.fetchMarket);
	const intl = useIntl();
	const [repaymentSchedule, setRepaymentSchedule] = useState<RepaymentSchedule>();
	const [tranches, setTranches] = useState<Tranches>();

	const getDealFromStore = useCallback(async () => {
		if (market) {
			const dealFromStore = await getDeal(client, market, dealId as string);
			setDeal(dealFromStore);
		}
	}, [client, market, dealId, getDeal]);

	const getRepaymentSchedule = useCallback(async () => {
		if (deal) {
			const repaymentSchedule = await deal.fetchRepaymentSchedule();
			setRepaymentSchedule(repaymentSchedule);
		}
	}, [deal]);

	const getTranches = useCallback(async () => {
		if (deal) {
			const tranches = await deal.fetchTranches();
			setTranches(tranches);
		}
	}, [deal]);

	const getMonthlyRepaymentAmount = useCallback(async () => {
		const amount = await calculateMonthlyRepaymentAmount(repaymentSchedule);
		setMonthlyRepaymentAmount(amount);
	}, [repaymentSchedule]);

	useEffect(() => {
		getMonthlyRepaymentAmount();
	}, [getMonthlyRepaymentAmount]);

	useEffect(() => {
		fetchMarket(client, marketplace as string);
	}, [fetchMarket, client, marketplace]);

	useEffect(() => {
		getDealFromStore();
	}, [getDealFromStore]);

	useEffect(() => {
		getTranches();
		getRepaymentSchedule();
	}, [getTranches, getRepaymentSchedule]);

	const onSubmit = ({ amount }: RepayDealFormInput) => {
		makeRepayment(amount);
	};

	const makeRepayment = async (amount: number) => {
		const formattedNumber = compactFormatter.format(amount);
		const hide = message.loading({
			content: intl.formatMessage(
				{
					defaultMessage: "Repaying {amount} USDC",
					description: "Repay deal: repayment loading",
				},
				{
					amount: formattedNumber,
				}
			),
		});

		try {
			const programAmount = toProgramAmount(new Big(amount));
			await deal.repay(programAmount.toNumber());
			hide();
			message.success({
				content: intl.formatMessage(
					{
						defaultMessage: "Successfully made repayment of {amount} USDC",
						description: "Repay deal: repayment success",
					},
					{
						amount: formattedNumber,
					}
				),
			});
			getDealFromStore();
		} catch (error) {
			hide();
			message.error({
				content: intl.formatMessage(
					{
						defaultMessage: "Failed to repay {amount} USDC",
						description: "Repay deal: repayment failed",
					},
					{
						amount: formattedNumber,
					}
				),
			});
		}
	};

	useEffect(() => {
		getDealFromStore();
	}, [getDealFromStore]);

	if (!deal) {
		return null;
	}

	return (
		<DealCard marketplace={marketplace as string} deal={deal}>
			<div className="space-y-6">
				<div className="flex items-center space-x-5">
					<Icon name="coin-insert" className="w-7 h-7" />
					<div className="uppercase text-2xl font-bold">
						{intl.formatMessage({
							defaultMessage: "make repayment",
							description: "Repay deal: title",
						})}
					</div>
				</div>
				{repaymentSchedule && (
					<DealAspectGrid deal={deal} tranches={tranches} repaymentSchedule={repaymentSchedule} />
				)}
				<RepayDealForm onSubmit={onSubmit} monthlyRepaymentAmount={monthlyRepaymentAmount} />
			</div>
		</DealCard>
	);
};

Repay.getLayout = function getLayout(page: ReactElement) {
	return (
		<Layout.WithSideMenu>
			<Layout.WithMainMenu showLogo={false}>{page}</Layout.WithMainMenu>
		</Layout.WithSideMenu>
	);
};

export async function getStaticPaths() {
	return {
		paths: await getMarketsPaths(),
		fallback: true,
	};
}

export async function getStaticProps(ctx) {
	const { params } = ctx;
	return {
		props: {
			intlMessages: await loadIntlMessages(ctx),
			...params,
		},
	};
}

export default Repay;
