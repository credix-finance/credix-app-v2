import React, { ReactElement, useEffect } from "react";
import { InvestWithdraw as InvestWithdrawComponent } from "@components/InvestWithdraw";
import { useCredixClient } from "@credix/credix-client";
import { defaultMarketplace } from "consts";
import { MarketStats } from "@components/MarketStats";
import Layout from "@components/Layout";
import { useStore } from "state/useStore";
import { useWallet } from "@solana/wallet-adapter-react";

function InvestWithdraw() {
	const client = useCredixClient();
	const fetchMarket = useStore((state) => state.fetchMarket);
	const market = useStore((state) => state.market);
	const { publicKey } = useWallet();

	useEffect(() => {
		if (publicKey) {
			fetchMarket(client, defaultMarketplace);
		}
	}, [publicKey, client, fetchMarket]);

	return (
		<div className="space-y-20 py-5 px-4 md:pt-12 md:px-20 md:grid md:justify-self-center md:w-full md:max-w-7xl lg:max-w-5xl">
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
