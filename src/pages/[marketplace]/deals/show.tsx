import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { Button } from "@components/Button";
import { DealDetails } from "@components/DealDetails";
import { Tranches, useCredixClient } from "@credix/credix-client";
import { useStore } from "@state/useStore";
import { useRouter } from "next/router";
import { multisigUrl } from "@consts";
import { DealCard } from "@components/DealCard";
import { NextPageWithLayout } from "pages/_app";
import { getMarketsPaths } from "@utils/export.utils";
import Layout from "@components/Layout";
import loadIntlMessages from "@utils/i18n.utils";
import { useIntl } from "react-intl";
import { DealWithNestedResources } from "@state/dealSlice";

const Show: NextPageWithLayout = () => {
	const router = useRouter();
	const { marketplace, dealId } = router.query;
	const client = useCredixClient();
	const fetchMarket = useStore((state) => state.fetchMarket);
	const market = useStore((state) => state.market);
	const getDeal = useStore((state) => state.getDeal);
	const [deal, setDeal] = useState<DealWithNestedResources>();
	const isAdmin = useStore((state) => state.isAdmin);
	const intl = useIntl();
	const [tranches, setTranches] = useState<Tranches>();

	const getDealFromStore = useCallback(async () => {
		if (market) {
			const dealFromStore = await getDeal(client, market, dealId as string);
			setDeal(dealFromStore);
		}
	}, [client, market, dealId, getDeal]);

	const getTranches = useCallback(async () => {
		if (deal) {
			const tranches = await deal.fetchTranches();
			setTranches(tranches);
		}
	}, [deal]);

	useEffect(() => {
		fetchMarket(client, marketplace as string);
	}, [fetchMarket, client, marketplace]);

	useEffect(() => {
		getDealFromStore();
	}, [getDealFromStore]);

	useEffect(() => {
		getTranches();
	}, [getTranches]);

	const activateDeal = async () => {
		window.open(multisigUrl, "_blank") || window.location.replace(multisigUrl);
	};

	if (!deal) {
		return null;
	}

	return (
		<DealCard marketplace={marketplace as string} deal={deal}>
			<DealDetails deal={deal} tranches={tranches} repaymentSchedule={deal.repaymentSchedule} />
			{isAdmin && deal.isPending() && (
				<Button
					type="default"
					size="large"
					className="mt-14 bg-neutral-0 capitalize"
					onClick={activateDeal}
				>
					{intl.formatMessage({
						defaultMessage: "activate deal",
						description: "Activate deal: button",
					})}
				</Button>
			)}
		</DealCard>
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
