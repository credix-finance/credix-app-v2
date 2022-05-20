import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Deal as DealType, useCredixClient } from "@credix/credix-client";
import { useStore } from "@state/useStore";
import RepayDealForm, { DEAL_REPAYMENT_TYPE, RepayDealFormInput } from "@components/RepayDealForm";
import { NextPageWithLayout } from "pages/_app";
import Layout from "@components/Layout";
import { numberFormatter, toProgramAmount, toUIAmount } from "@utils/format.utils";
import message from "message";
import Big from "big.js";
import DealAspectGrid from "@components/DealAspectGrid";
import { Icon } from "@components/Icon";
import { calculateMonthlyRepaymentAmount } from "@utils/deal.utils";
import { DealCard } from "@components/DealCard";
import { getMarketsPaths } from "@utils/export.utils";
import loadIntlMessages from "@utils/i18n.utils";
import { useIntl } from "react-intl";
import notification from "notification";

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

	const getDealFromStore = useCallback(async () => {
		try {
			if (market) {
				const dealFromStore = await getDeal(market, dealId as string);
				setDeal(dealFromStore);
			}
		} catch {
			notification.error({
				message: intl.formatMessage({
					defaultMessage: "Failed to fetch deal",
					description: "Repay deal: fetch deal failed",
				}),
			});
		}
	}, [market, dealId, getDeal, intl]);

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
		const hide = message.loading({
			content: intl.formatMessage(
				{
					defaultMessage: "Repaying {amount} USDC of interest",
					description: "Repay deal: interest repayment loading",
				},
				{
					amount: formattedNumber,
				}
			),
		});

		try {
			const programAmount = toProgramAmount(new Big(amount));
			await deal.repayInterest(programAmount.toNumber());
			hide();
			notification.success({
				message: intl.formatMessage(
					{
						defaultMessage: "Successfully paid {amount} USDC of interest",
						description: "Repay deal: interest repayment success",
					},
					{
						amount: formattedNumber,
					}
				),
			});
			getDealFromStore();
		} catch (error) {
			hide();
			notification.error({
				message: intl.formatMessage(
					{
						defaultMessage: "Failed to pay {amount} USDC of interest",
						description: "Repay deal: interest repayment failed",
					},
					{
						amount: formattedNumber,
					}
				),
				error,
			});
		}
	};

	const repayPrincipal = async (amount: number) => {
		const formattedNumber = numberFormatter.format(amount);
		const hide = message.loading({
			content: intl.formatMessage(
				{
					defaultMessage: "Repaying {amount} USDC of principal",
					description: "Repay deal: principal repayment loading",
				},
				{
					amount: formattedNumber,
				}
			),
		});

		try {
			const programAmount = toProgramAmount(new Big(amount));
			await deal.repayPrincipal(programAmount.toNumber());
			hide();
			notification.success({
				message: intl.formatMessage(
					{
						defaultMessage: "Successfully paid {amount} USDC of principal",
						description: "Repay deal: principal repayment success",
					},
					{
						amount: formattedNumber,
					}
				),
			});
			getDealFromStore();
		} catch (error) {
			hide();
			notification.error({
				message: intl.formatMessage(
					{
						defaultMessage: "Failed to pay {amount} USDC of principal",
						description: "Repay deal: principal repayment failed",
					},
					{
						amount: formattedNumber,
					}
				),
				error,
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
				<DealAspectGrid deal={deal} />
				<RepayDealForm
					deal={deal}
					onSubmit={onSubmit}
					maxInterestRepayment={toUIAmount(deal.interestToRepay).toNumber()}
					maxPrincipalRepayment={toUIAmount(deal.principalToRepay).toNumber()}
					monthlyRepaymentAmount={monthlyRepaymentAmount}
				/>
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
