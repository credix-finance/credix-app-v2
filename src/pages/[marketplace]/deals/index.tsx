import { ReactElement, useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import { Deal, Ratio, useCredixClient } from "@credix/credix-client";
import { toUIAmount, formatTimestamp } from "@utils/format.utils";
import { Tabs } from "@components/Tabs";
import { TabPane } from "@components/TabPane";
import { Table, ColumnsProps } from "@components/Table";
import { Icon } from "@components/Icon";
import { Slider } from "@components/Slider";
import { Button } from "@components/Button";
import Link from "next/link";
import Big from "big.js";
import { useLocales } from "@hooks/useLocales";
import { useStore } from "@state/useStore";
import Layout from "@components/Layout";
import { NextPageWithLayout } from "pages/_app";
import { selectActiveDeals, selectEndedDeals, selectPendingDeals } from "@state/selectors";

const dealsTableColumns: ColumnsProps[] = [
	{
		title: "Name",
		icon: "stacked-column-down",
		dataIndex: "name",
		key: "name",
		width: "40%",
		ellipsis: true,
	},
	{
		title: "Amount",
		icon: "coins-alt",
		dataIndex: "amount",
		key: "amount",
		width: "20%",
		render: (text) => <span className="font-medium text-lg">{text} USDC</span>,
	},
	{
		title: "Date",
		icon: "calendar",
		dataIndex: "date",
		key: "date",
		width: "20%",
		render: (text) => <span className="font-medium text-lg">{text}</span>,
	},
	{
		title: "Paid",
		dataIndex: "paid",
		key: "paid",
		width: "20%",
		render: (value: number) => <Slider value={value} fullLabel="Full" />,
	},
];

const Deals: NextPageWithLayout = () => {
	const router = useRouter();
	const locales = useLocales();
	const { marketplace } = router.query;
	const client = useCredixClient();
	const fetchMarket = useStore((state) => state.fetchMarket);
	const market = useStore((state) => state.market);
	const maybeFetchDeals = useStore((state) => state.maybeFetchDeals);
	const activeDeals = useStore((state) => selectActiveDeals(state));
	const endedDeals = useStore((state) => selectEndedDeals(state));
	const pendingDeals = useStore((state) => selectPendingDeals(state));
	const isLoadingDeals = useStore((state) => state.isLoadingDeals);
	const isAdmin = useStore((state) => state.isAdmin);

	useEffect(() => {
		fetchMarket(client, marketplace as string);
	}, [fetchMarket, client, marketplace]);

	useEffect(() => {
		maybeFetchDeals(market);
	}, [market, maybeFetchDeals]);

	const dealRepaidRatio = (principal: Big, principalAmountRepaid: Big) => {
		if (!principalAmountRepaid.toNumber()) {
			return 0;
		}

		const repaidRatio = new Ratio(principal.toNumber(), principalAmountRepaid.toNumber());

		return repaidRatio.apply(100);
	};

	const mapDeal = useCallback(
		({ address, name, principal, goLiveAt, principalAmountRepaid }: Deal) => {
			return {
				key: address.toString(),
				name: name,
				amount: toUIAmount(new Big(principal)).toNumber(),
				date: formatTimestamp(goLiveAt, locales as string[]),
				paid: dealRepaidRatio(new Big(principal), new Big(principalAmountRepaid)),
			};
		},
		[locales]
	);

	const investButton = (
		<Link href={`/${marketplace}/invest`}>
			<a>
				<Button size="large" icon={<Icon name="plus-square" className="w-5 h-5" />}>
					<span className="text-lg">Invest</span>
				</Button>
			</a>
		</Link>
	);

	const newDealButton = (
		<Link href={`/${marketplace}/deals/new`}>
			<a>
				<Button size="large" icon={<Icon name="plus-square" className="w-5 h-5" />}>
					<span className="text-lg capitalize">create new deal</span>
				</Button>
			</a>
		</Link>
	);

	const actionButton = isAdmin ? newDealButton : investButton;

	const dealShowRoute = (marketplace: string, id: string) => `/${marketplace}/deals/${id}/show`;

	return (
		<div className="space-y-14 py-5 px-4 md:pt-12 md:px-28">
			<Tabs tabBarExtraContent={actionButton}>
				<TabPane tab="Active Deals" key="activeDealsTab">
					<Table
						loading={isLoadingDeals}
						onRow={(record) => {
							return {
								onClick: () => {
									router.push(dealShowRoute(marketplace as string, record?.key));
								},
							};
						}}
						dataSource={activeDeals?.map((deal) => mapDeal(deal))}
						columns={dealsTableColumns}
					/>
				</TabPane>
				{isAdmin && (
					<TabPane tab="Pending Deals" key="2">
						<Table
							loading={isLoadingDeals}
							onRow={(record) => {
								return {
									onClick: () => {
										router.push(dealShowRoute(marketplace as string, record?.key));
									},
								};
							}}
							dataSource={pendingDeals?.map((deal) => mapDeal(deal))}
							columns={dealsTableColumns}
						/>
					</TabPane>
				)}
				<TabPane tab="Ended Deals" key="3">
					<Table
						loading={isLoadingDeals}
						onRow={(record) => {
							return {
								onClick: () => {
									router.push(dealShowRoute(marketplace as string, record?.key));
								},
							};
						}}
						dataSource={endedDeals?.map((deal) => mapDeal(deal))}
						columns={dealsTableColumns}
					/>
				</TabPane>
			</Tabs>
		</div>
	);
};

Deals.getLayout = function getLayout(page: ReactElement) {
	return (
		<Layout.WithSideMenu>
			<Layout.WithMainMenu showLogo={false}>{page}</Layout.WithMainMenu>
		</Layout.WithSideMenu>
	);
};

export default Deals;
