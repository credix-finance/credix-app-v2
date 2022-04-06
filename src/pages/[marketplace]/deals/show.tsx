import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { Button } from "@components/Button";
import { DealDetails } from "@components/DealDetails";
import { Deal as DealType, useCredixClient } from "@credix/credix-client";
import { useStore } from "@state/useStore";
import { useRouter } from "next/router";
import { multisigUrl } from "@consts";
import { DealCard } from "@components/DealCard";
import { NextPageWithLayout } from "pages/_app";
import { getMarketsPaths } from "@utils/export.utils";
import Layout from "@components/Layout";

const Show: NextPageWithLayout = () => {
	const router = useRouter();
	const { marketplace, did } = router.query;
	const client = useCredixClient();
	const fetchMarket = useStore((state) => state.fetchMarket);
	const market = useStore((state) => state.market);
	const getDeal = useStore((state) => state.getDeal);
	const [deal, setDeal] = useState<DealType>();
	const isAdmin = useStore((state) => state.isAdmin);

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

	const activateDeal = async () => {
		window.open(multisigUrl, "_blank") || window.location.replace(multisigUrl);
	};

	if (!deal) {
		return null;
	}

	return (
		<DealCard marketplace={marketplace as string} deal={deal}>
			<DealDetails deal={deal} />
			{isAdmin && deal.isPending() && (
				<Button type="default" size="large" className="mt-14 bg-neutral-0" onClick={activateDeal}>
					Activate Deal
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

export async function getStaticProps({ params }) {
	return { props: params };
}

export default Show;
