import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { DealStatus, useCredixClient } from "@credix/credix-client";
import { useStore } from "@state/useStore";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "pages/_app";
import { getMarketsPaths } from "@utils/export.utils";
import Layout from "@components/Layout";
import loadIntlMessages from "@utils/i18n.utils";
import { DealWithNestedResources } from "@state/dealSlice";
import { OpenForFunding } from "@components/OpenForFunding";
import { Pending } from "@components/Pending";

const Show: NextPageWithLayout = () => {
	const router = useRouter();
	const { marketplace, dealId } = router.query;
	const client = useCredixClient();
	const fetchMarket = useStore((state) => state.fetchMarket);
	const market = useStore((state) => state.market);
	const getDeal = useStore((state) => state.getDeal);
	const [deal, setDeal] = useState<DealWithNestedResources>();
	const [dealStatus, setDealStatus] = useState<DealStatus>();

	const getDealFromStore = useCallback(async () => {
		if (market) {
			const dealFromStore = await getDeal(client, market, dealId as string);
			setDeal(dealFromStore);
		}
	}, [client, market, dealId, getDeal]);

	const getDealStatus = useCallback(async () => {
		if (deal) {
			const dealStatus = await deal.status();

			setDealStatus(dealStatus);
		}
	}, [deal]);

	useEffect(() => {
		fetchMarket(client, marketplace as string);
	}, [fetchMarket, client, marketplace]);

	useEffect(() => {
		getDealFromStore();
	}, [getDealFromStore]);

	useEffect(() => {
		getDealStatus();
	}, [getDealStatus]);

	if (!deal) {
		return null;
	}

	return (
		<div className="py-5 px-4 md:p-20 md:justify-self-center w-full">
			{dealStatus === DealStatus.PENDING && (
				<Pending
					marketplace={marketplace as string}
					deal={deal}
					tranches={deal.tranches}
					repaymentSchedule={deal.repaymentSchedule}
				/>
			)}
			{dealStatus === DealStatus.IN_PROGRESS && <div>IN PROGRESS</div>}
			{dealStatus === DealStatus.CLOSED && <div>CLOSED</div>}
			{dealStatus === DealStatus.OPEN_FOR_FUNDING && (
				<OpenForFunding
					marketplace={marketplace as string}
					deal={deal}
					tranches={deal.tranches}
					repaymentSchedule={deal.repaymentSchedule}
				/>
			)}
		</div>
	);
};

Show.getLayout = function getLayout(page: ReactElement) {
	return (
		<Layout.WithSideMenu>
			<Layout.WithMainMenu showLogo={false}>{page}</Layout.WithMainMenu>
		</Layout.WithSideMenu>
	);
};

export async function getStaticPaths() {
	return {
		paths: getMarketsPaths(),
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

export default Show;
