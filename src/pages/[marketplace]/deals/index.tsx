import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Deal, Fraction, useCredixClient } from "@credix/credix-client";
import { toUIAmount, formatTimestamp, compactFormatter } from "@utils/format.utils";
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
import { useWallet } from "@solana/wallet-adapter-react";
import { getMarketsPaths } from "@utils/export.utils";
import loadIntlMessages from "@utils/i18n.utils";
import { useIntl } from "react-intl";
import { totalInterestRepaid, totalPrincipalRepaid } from "@utils/deal.utils";
import { calculateTotalInterest } from "@utils/tranche.utils";
import { usePendingDeals } from "@hooks/usePendingDeals";
import { useActiveDeals } from "@hooks/useActiveDeals";
import { useClosedDeals } from "@hooks/useClosedDeals";
import { DealWithNestedResources } from "@state/dealSlice";
import { useOpenForFundingDeals } from "@hooks/useOpenForFundingDeals";

interface DealsTableDeal {
	key: string;
	name: string;
	amount: string;
	date: number;
	paid: string;
	repay: {
		isRepayable: boolean;
		path: string;
	};
}

const Deals: NextPageWithLayout = () => {
	const router = useRouter();
	const locales = useLocales();
	const { marketplace } = router.query;
	const client = useCredixClient();
	const fetchMarket = useStore((state) => state.fetchMarket);
	const market = useStore((state) => state.market);
	const maybeFetchDeals = useStore((state) => state.maybeFetchDeals);
	const deals = useStore((state) => state.deals);
	const openDeals = useOpenForFundingDeals(deals);
	const pendingDeals = usePendingDeals(deals);
	const activeDeals = useActiveDeals(deals);
	const closedDeals = useClosedDeals(deals);
	const isLoadingDeals = useStore((state) => state.isLoadingDeals);
	const isAdmin = useStore((state) => state.isAdmin);
	const [isInvestor, setIsInvestor] = useState<boolean>(null);
	const { publicKey } = useWallet();
	const intl = useIntl();

	const dealsTableColumns: ColumnsProps[] = [
		{
			title: "Name",
			icon: "stacked-column-down",
			dataIndex: "name",
			key: "name",
			ellipsis: true,
		},
		{
			title: "Amount",
			icon: "coins-alt",
			dataIndex: "amount",
			key: "amount",
			width: 200,
			titleClassName: "justify-end",
			align: "right",
			render: (text) => <span className="font-medium text-lg">{text} USDC</span>,
		},
		{
			title: "Date",
			icon: "calendar",
			dataIndex: "date",
			key: "date",
			width: 160,
			render: (text) => (
				<span className="font-medium text-lg">
					{text && formatTimestamp(text, locales as string[])}
				</span>
			),
		},
		{
			title: "Interest paid",
			dataIndex: "paid",
			key: "paid",
			width: 180,
			render: (value: number) => <Slider value={value} fullLabel="Full" />,
		},
		{
			dataIndex: "repay",
			key: "repay",
			width: 138,
			className: "flex justify-end",
			// Invisible title so that the table layout isn't messed up
			title: () => <div className="invisible">Repay</div>,
			titleClassName: "table-cell",
			render: ({ isRepayable, path }) => (
				<>
					{isRepayable ? (
						<Link href={path}>
							<a>
								<Button size="large">
									<span className="capitalize">
										{intl.formatMessage({
											defaultMessage: "repay",
											description: "Deals: repay button",
										})}
									</span>
								</Button>
							</a>
						</Link>
					) : (
						<Link href={path}>
							<a className="w-full">
								<Button size="large" className="w-full">
									<span className="capitalize">
										{intl.formatMessage({
											defaultMessage: "info",
											description: "Deals: info button",
										})}
									</span>
								</Button>
							</a>
						</Link>
					)}
				</>
			),
		},
	];

	useEffect(() => {
		fetchMarket(client, marketplace as string);
	}, [fetchMarket, client, marketplace]);

	useEffect(() => {
		maybeFetchDeals(client, market);
	}, [client, market, maybeFetchDeals]);

	const mapDeal = useCallback(
		(deal: DealWithNestedResources): DealsTableDeal => {
			const { address, name, goLiveAt, borrower } = deal;
			const principal = totalPrincipalRepaid(deal.tranches);
			const interestRepaid = totalInterestRepaid(deal.tranches);
			const totalInterest = calculateTotalInterest(300, new Fraction(10, 100), 1000000);

			const isRepayable = borrower.toString() === publicKey?.toString();
			const path = `/${marketplace}/deals/${
				isRepayable ? "repay" : "show"
			}?dealId=${address.toString()}`;

			return {
				key: address.toString(),
				name: name,
				amount: compactFormatter.format(toUIAmount(new Big(principal)).toNumber()),
				date: goLiveAt,
				paid: compactFormatter.format(
					new Fraction(
						toUIAmount(new Big(interestRepaid)).toNumber(),
						toUIAmount(totalInterest).toNumber()
					)
						.apply(100)
						.toNumber()
				),
				repay: {
					isRepayable,
					path,
				},
			};
		},
		[marketplace, publicKey]
	);

	const mapDeals = (deals: Deal[]) =>
		deals
			.slice()
			// TODO: move this to the client
			.filter((deal) => isInvestor || deal.borrower.toString() === publicKey.toString())
			.map(mapDeal)
			.sort((a, b) => (a.date <= b.date ? 1 : -1));

	const newDealButton = (
		<Link href={`/${marketplace}/deals/new`}>
			<a>
				<Button size="large" icon={<Icon name="plus-square" className="w-5 h-5" />}>
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

	const fetchCredixPass = useCallback(async () => {
		try {
			const credixPass = await market.fetchCredixPass(publicKey);

			setIsInvestor(credixPass.isInvestor);
		} catch (err) {
			setIsInvestor(null);
		}
	}, [market, publicKey]);

	useEffect(() => {
		fetchCredixPass();
	}, [fetchCredixPass]);

	return (
		<div className="space-y-14 py-5 px-4 md:pt-20 md:px-28">
			<Tabs tabBarExtraContent={<div className="flex space-x-2">{isAdmin && newDealButton}</div>}>
				<TabPane
					tab={intl.formatMessage({
						defaultMessage: "Open for funding",
						description: "Deals: open for funding deals tab",
					})}
					key="openForFundingDealsTab"
				>
					<Table
						loading={isLoadingDeals}
						dataSource={openDeals && mapDeals(openDeals)}
						columns={dealsTableColumns}
					/>
				</TabPane>
				<TabPane
					tab={intl.formatMessage({
						defaultMessage: "Active",
						description: "Deals: active deals tab",
					})}
					key="activeDealsTab"
				>
					<Table
						loading={isLoadingDeals}
						dataSource={activeDeals && mapDeals(activeDeals)}
						columns={dealsTableColumns}
					/>
				</TabPane>
				{isAdmin && (
					<TabPane
						tab={intl.formatMessage({
							defaultMessage: "Pending",
							description: "Deals: pending deals tab",
						})}
						key="pendingDealsTab"
					>
						<Table
							loading={isLoadingDeals}
							dataSource={pendingDeals && mapDeals(pendingDeals)}
							columns={dealsTableColumns}
						/>
					</TabPane>
				)}
				<TabPane
					tab={intl.formatMessage({
						defaultMessage: "Closed",
						description: "Deals: closed deals tab",
					})}
					key="closedDealsTab"
				>
					<Table
						loading={isLoadingDeals}
						dataSource={closedDeals && mapDeals(closedDeals)}
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

export default Deals;
