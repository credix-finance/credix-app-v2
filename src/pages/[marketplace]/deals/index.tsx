import { Button } from "@components/Button";
import { Icon } from "@components/Icon";
import Layout from "@components/Layout";
import { DealsTable } from "@components/tables/DealsTable";
import { TabPane } from "@components/TabPane";
import { Tabs } from "@components/Tabs";
import { DealStatus, useCredixClient } from "@credix/credix-client";
import { fetchMarketSelector, isAdminSelector, marketSelector } from "@state/selectors";
import { useStore } from "@state/useStore";
import { getMarketsPaths } from "@utils/export.utils";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement, useEffect } from "react";
import { defineMessages, useIntl } from "react-intl";
import loadIntlMessages from "@utils/i18n.utils";

const MESSAGES = defineMessages({
	title: {
		description: "Deals page title",
		defaultMessage: "Deals",
	},
	openForFunding: {
		description: "Deals page - open for funding tab",
		defaultMessage: "Open for funding",
	},
	pending: {
		description: "Deals page - pending tab",
		defaultMessage: "Pending",
	},
	inProgress: {
		description: "Deals page - in progress tab",
		defaultMessage: "In progress",
	},
	closed: {
		description: "Deals page - closed tab",
		defaultMessage: "Closed",
	},
});

const DealsPage = () => {
	const intl = useIntl();
	const market = useStore(marketSelector);
	const isAdmin = useStore(isAdminSelector);
	const router = useRouter();
	const { marketplace } = router.query;
	const fetchMarket = useStore(fetchMarketSelector);
	const client = useCredixClient();

	useEffect(() => {
		fetchMarket(client, marketplace as string);
	}, [fetchMarket, client, marketplace]);

	const newDealButton = (
		<Link href={`/${marketplace}/deals/new`}>
			<a>
				<Button icon={<Icon name="plus-square" className="w-5 h-5" />} data-cy="create-deal-button">
					<span className="text-lg capitalize">
						{intl.formatMessage({
							defaultMessage: "create new deal",
							description: "Deals: new deal button",
						})}
					</span>
				</Button>
			</a>
		</Link>
	);

	if (!market) {
		return null;
	}

	return (
		<div className="space-y-14 py-5 px-4 md:pt-20 md:px-28">
			<h2 className="text-5xl md:text-5xl lg:text-5xl font-semibold font-sans">
				{intl.formatMessage(MESSAGES.title)}
			</h2>
			<Tabs tabBarExtraContent={<div className="flex space-x-2">{isAdmin && newDealButton}</div>}>
				<TabPane tab={intl.formatMessage(MESSAGES.pending)} key="pendingDeals">
					<DealsTable market={market} status={DealStatus.PENDING}></DealsTable>
				</TabPane>
				<TabPane tab={intl.formatMessage(MESSAGES.openForFunding)} key="openForFundingDeals">
					<DealsTable market={market} status={DealStatus.OPEN_FOR_FUNDING}></DealsTable>
				</TabPane>
				<TabPane tab={intl.formatMessage(MESSAGES.inProgress)} key="inProgressDeals">
					<DealsTable market={market} status={DealStatus.IN_PROGRESS}></DealsTable>
				</TabPane>
				<TabPane tab={intl.formatMessage(MESSAGES.closed)} key="closedDeals">
					<DealsTable market={market} status={DealStatus.CLOSED}></DealsTable>
				</TabPane>
			</Tabs>
		</div>
	);
};

DealsPage.getLayout = function getLayout(page: ReactElement) {
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

export default DealsPage;
