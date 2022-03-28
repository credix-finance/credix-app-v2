import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { Button } from "@components/Button";
import { DealDetails } from "@components/DealDetails";
import Layout from "@components/Layout";
import { Link } from "@components/Link";
import { Deal as DealType, useCredixClient } from "@credix/credix-client";
import { useStore } from "@state/useStore";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "pages/_app";

const Deal: NextPageWithLayout = () => {
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
		try {
			await deal.activate();
			// TODO: trigger success message
			// TODO: refresh deal in store
		} catch {
			// TODO: trigger error message
		}
	};

	if (!deal) {
		return null;
	}

	return (
		<div className="px-4 py-5 md:pt-20 max-w-3xl flex flex-col justify-self-center">
			<Link to={`/${marketplace}/deals`} label="Go back to all deals" icon="chevron-left-square" />
			<div className="text-4xl font-sans pt-3 pb-5 break-words">{deal.name}</div>
			<div className="bg-neutral-0 pb-12">
				<DealDetails deal={deal} />
				{isAdmin && deal.isPending() && (
					<Button type="default" className="ml-12" onClick={activateDeal}>
						Activate Deal
					</Button>
				)}
			</div>
		</div>
	);
};

Deal.getLayout = function getLayout(page: ReactElement) {
	return <Layout.WithMainMenu showLogo={false}>{page}</Layout.WithMainMenu>;
};

export default Deal;
