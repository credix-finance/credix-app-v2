import React, { ReactElement, useEffect } from "react";
import { InvestWithdraw as InvestWithdrawComponent } from "@components/InvestWithdraw";
import { useCredixClient } from "@credix/credix-client";
import { defaultMarketplace } from "consts";
import { MarketStats } from "@components/MarketStats";
import Layout from "@components/Layout";
import { useStore } from "state/useStore";

function InvestWithdraw() {
	const client = useCredixClient();
	const maybeFetchMarket = useStore((state) => state.maybeFetchMarket);
	const market = useStore((state) => state.market);

	useEffect(() => {
		maybeFetchMarket(client, defaultMarketplace);
	}, [client, maybeFetchMarket]);

	return (
		<div className="space-y-20 py-5 px-4 md:pt-24 md:px-32">
			<div className="md:-ml-[22px]">
				<MarketStats market={market} />
			</div>
			<InvestWithdrawComponent />
		</div>
	);
}

InvestWithdraw.getLayout = function getLayout(page: ReactElement) {
	return (
		<Layout.WithSideMenu>
			<Layout.WithMainMenu showLogo={false}>{page}</Layout.WithMainMenu>
		</Layout.WithSideMenu>
	);
};

export default InvestWithdraw;
