import { ReactElement, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Deal, Ratio, useCredixClient } from "@credix/credix-client";
import { toUIAmount, formatTimestamp, numberFormatter } from "@utils/format.utils";
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
import { useWallet } from "@solana/wallet-adapter-react";

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
	const [isUnderwriter, setIsUnderwriter] = useState<boolean>(null);
	const { publicKey } = useWallet();

	const dealsTableColumns: ColumnsProps[] = [
		{
			title: "Name",
			icon: "stacked-column-down",
			dataIndex: "name",
			key: "name",
			ellipsis: true,
			className: "hover:cursor-pointer hover:bg-neutral-10 table-header-no-hover",
			onCell: (record) => {
				return {
					onClick: () => {
						router.push(dealShowRoute(marketplace as string, record?.key));
					},
				};
			},
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
			width: 150,
			render: (text) => (
				<span className="font-medium text-lg">
					{text && formatTimestamp(text, locales as string[])}
				</span>
			),
		},
		{
			title: "Paid",
			dataIndex: "paid",
			key: "paid",
			width: 150,
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
									<span>Repay</span>
								</Button>
							</a>
						</Link>
					) : (
						// Invisible button so that the table layout isn't messed up
						<Button size="large" className="invisible"></Button>
					)}
				</>
			),
		},
	];

	useEffect(() => {
		fetchMarket(client, marketplace as string);
	}, [fetchMarket, client, marketplace]);

	useEffect(() => {
		maybeFetchDeals(market);
	}, [market, maybeFetchDeals]);

	const mapDeal = useCallback(
		({ address, name, principal, goLiveAt, interestRepaid, totalInterest, borrower }: Deal) => {
			return {
				key: address.toString(),
				name: name,
				amount: numberFormatter.format(toUIAmount(new Big(principal)).toNumber()),
				date: goLiveAt,
				paid: numberFormatter.format(
					new Ratio(
						toUIAmount(new Big(interestRepaid)).toNumber(),
						toUIAmount(totalInterest).toNumber()
					)
						.apply(100)
						.toNumber()
				),
				repay: {
					isRepayable: borrower.toString() === publicKey?.toString(),
					path: `/${marketplace}/deals/${address.toString()}/repay`,
				},
			};
		},
		[marketplace, publicKey]
	);

	const mapDeals = (deals: Deal[]) =>
		deals
			.slice()
			.map(mapDeal)
			.sort((a, b) => (a.date <= b.date ? 1 : -1));

	const investButton = (
		<Link href={`/${marketplace}/invest-withdraw`}>
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

	const fetchIsBorrower = useCallback(async () => {
		try {
			const credixPass = await market.fetchCredixPass(publicKey);

			setIsUnderwriter(credixPass.isUnderwriter);
		} catch (err) {
			setIsUnderwriter(null);
		}
	}, [market, publicKey]);

	useEffect(() => {
		fetchIsBorrower();
	}, [fetchIsBorrower]);

	const dealShowRoute = (marketplace: string, id: string) => `/${marketplace}/deals/${id}/show`;

	return (
		<div className="space-y-14 py-5 px-4 md:pt-20 md:px-28">
			<Tabs
				tabBarExtraContent={
					<div className="flex space-x-2">
						{isAdmin && newDealButton}
						{isUnderwriter && investButton}
					</div>
				}
			>
				<TabPane tab="Active Deals" key="activeDealsTab">
					<Table
						loading={isLoadingDeals}
						dataSource={activeDeals && mapDeals(activeDeals)}
						columns={dealsTableColumns}
					/>
				</TabPane>
				{isAdmin && (
					<TabPane tab="Pending Deals" key="2">
						<Table
							loading={isLoadingDeals}
							dataSource={pendingDeals && mapDeals(pendingDeals)}
							columns={dealsTableColumns}
						/>
					</TabPane>
				)}
				<TabPane tab="Ended Deals" key="3">
					<Table
						loading={isLoadingDeals}
						dataSource={endedDeals && mapDeals(endedDeals)}
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
