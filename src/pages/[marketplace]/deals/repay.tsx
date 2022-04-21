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

const Repay: NextPageWithLayout = () => {
	const router = useRouter();
	const { marketplace, dealId } = router.query;
	const client = useCredixClient();
	const getDeal = useStore((state) => state.getDeal);
	const [deal, setDeal] = useState<DealType>();
	const [monthlyRepaymentAmount, setMonthlyRepaymentAmount] = useState<number>();
	const market = useStore((state) => state.market);
	const fetchMarket = useStore((state) => state.fetchMarket);

	const getDealFromStore = useCallback(async () => {
		if (market) {
			const dealFromStore = await getDeal(market, dealId as string);
			setDeal(dealFromStore);
		}
	}, [market, dealId, getDeal]);

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
				content: "Interest needs to be repaid in full before the principal can be repaid.",
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
		<DealCard marketplace={marketplace as string} deal={deal}>
			<div className="space-y-6">
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

export async function getStaticProps({ params }) {
	return { props: params };
}

export default Repay;
