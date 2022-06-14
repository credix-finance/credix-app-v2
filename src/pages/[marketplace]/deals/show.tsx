import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { useCredixClient } from "@credix/credix-client";
import { useStore } from "@state/useStore";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "pages/_app";
import { getMarketsPaths } from "@utils/export.utils";
import Layout from "@components/Layout";
import loadIntlMessages from "@utils/i18n.utils";
import { DealWithNestedResources } from "@state/dealSlice";
import { OpenForFunding } from "@components/OpenForFunding";

const Show: NextPageWithLayout = () => {
	const router = useRouter();
	const { marketplace, dealId } = router.query;
	const client = useCredixClient();
	const fetchMarket = useStore((state) => state.fetchMarket);
	const market = useStore((state) => state.market);
	const getDeal = useStore((state) => state.getDeal);
	const [deal, setDeal] = useState<DealWithNestedResources>();

	const getDealFromStore = useCallback(async () => {
		if (market) {
			const dealFromStore = await getDeal(client, market, dealId as string);
			setDeal(dealFromStore);
		}
	}, [client, market, dealId, getDeal]);

	useEffect(() => {
		fetchMarket(client, marketplace as string);
	}, [fetchMarket, client, marketplace]);

	useEffect(() => {
		getDealFromStore();
	}, [getDealFromStore]);

	if (!deal) {
		return null;
	}

	return (
		<div className="py-5 px-4 md:p-20 md:justify-self-center w-full">
			<OpenForFunding
				marketplace={marketplace as string}
				deal={deal}
				tranches={deal.tranches}
				repaymentSchedule={deal.repaymentSchedule}
			/>
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
