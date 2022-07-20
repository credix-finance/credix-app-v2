import React, { ReactElement, useEffect } from "react";
import { InvestWithdraw as InvestWithdrawComponent } from "@components/InvestWithdraw";
import { useCredixClient } from "@credix/credix-client";
import { MarketStats } from "@components/MarketStats";
import Layout from "@components/Layout";
import { useStore } from "state/useStore";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/router";
import { getMarketsPaths } from "@utils/export.utils";
import loadIntlMessages from "@utils/i18n.utils";

function InvestWithdraw() {
	const router = useRouter();
	const { marketplace } = router.query;
	const client = useCredixClient();
	const fetchMarket = useStore((state) => state.fetchMarket);
	const market = useStore((state) => state.market);
	const { publicKey } = useWallet();

	useEffect(() => {
		if (publicKey) {
			fetchMarket(client, marketplace as string);
		}
	}, [publicKey, client, fetchMarket, marketplace]);

	return (
		<div>
			<div className="md:-ml-[22px] mb-16">
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

export default InvestWithdraw;
