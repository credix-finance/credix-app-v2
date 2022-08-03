import React, { ReactElement, useEffect, useState } from "react";
import { useCredixClient } from "@credix/credix-client";
import { MarketStats } from "@components/MarketStats";
import Layout from "@components/Layout";
import { useStore } from "state/useStore";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/router";
import { getMarketsPaths } from "@utils/export.utils";
import loadIntlMessages from "@utils/i18n.utils";
import { InvestmentDetails } from "@components/InvestmentDetails";
import { useUserBaseBalance } from "@hooks/useUserBaseBalance";
import { defineMessages } from "@formatjs/intl";
import { useIntl } from "react-intl";
import notification from "@notification";
import { WithdrawFromMarket } from "@components/WithdrawFromMarket";
import { InvestInMarket } from "../../components/InvestInMarket";

function InvestWithdraw() {
	const router = useRouter();
	const { marketplace } = router.query;
	const client = useCredixClient();
	const fetchMarket = useStore((state) => state.fetchMarket);
	const market = useStore((state) => state.market);
	const { publicKey } = useWallet();
	const [userStake, setUserStake] = useState<number>(0);
	const userBaseBalance = useUserBaseBalance();
	const intl = useIntl();

	useEffect(() => {
		if (publicKey) {
			fetchMarket(client, marketplace as string);
		}
	}, [publicKey, client, fetchMarket, marketplace]);

	useEffect(() => {
		const getUserStake = async () => {
			if (!publicKey) {
				return;
			}

			try {
				const userStake = await market?.getUserStake(publicKey);

				if (userStake) {
					setUserStake(userStake.uiAmount);
				}
			} catch (err) {
				setUserStake(0);
			}
		};
		getUserStake();
	}, [market, publicKey]);

	const refreshMarket = async () => {
		try {
			await fetchMarket(client, marketplace as string);
		} catch {
			notification.error({
				message: intl.formatMessage(MESSAGES.refreshMarketFailure),
			});
		}
	};

	return (
		<div>
			<div className="md:-ml-[22px] mb-12">
				<MarketStats market={market} />
			</div>
			<div className="w-full h-[1px] mb-14 bg-neutral-105"></div>
			<div className="space-y-6">
				<div className="font-sans text-4xl font-semibold">
					{intl.formatMessage(MESSAGES.yourWallet)}
				</div>
				<InvestmentDetails balance={userStake} balanceCurrency="USDC" />
				<div className="grid grid-cols-1 md:grid-cols-2 gap-12">
					<InvestInMarket balance={userBaseBalance} market={market} refreshMarket={refreshMarket} />
					<WithdrawFromMarket userStake={userStake} market={market} refreshMarket={refreshMarket} />
				</div>
			</div>
		</div>
	);
}

export const MESSAGES = defineMessages({
	refreshMarketFailure: {
		defaultMessage: "Failed to refresh market stats",
		description: "InvestWithdraw: refresh market failed",
	},
	yourWallet: {
		defaultMessage: "Your investments",
		description: "invest-withdraw: your investments",
	},
});

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
