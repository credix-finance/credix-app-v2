import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import { Deal, DealStatus, Ratio, useCredixClient } from "@credix/credix-client";
import { toUIAmount, formatRatio, formatTimestamp } from "../../utils/format.utils";
import { Tabs } from "@components/Tabs";
import { TabPane } from "@components/TabPane";
import { Table, ColumnsProps } from "@components/Table";
import { Icon } from "@components/Icon";
import { Slider } from "@components/Slider";
import { Button } from "@components/Button";
import Link from "next/link";
import Big from "big.js";
import { useLocales } from "../../hooks/useLocales";
import { useStore } from "@state/useStore";

const dealsTableColumns: ColumnsProps[] = [
	{
		title: "Name",
		icon: "stacked-column-down",
		dataIndex: "name",
		key: "name",
	},
	{
		title: "Amount",
		icon: "coins-alt",
		dataIndex: "amount",
		key: "amount",
		render: (text) => <span className="font-medium text-lg">{text}</span>,
	},
	{
		title: "Date",
		icon: "calendar",
		dataIndex: "date",
		key: "date",
		render: (text) => <span className="font-medium text-lg">{text}</span>,
	},
	{
		title: "Paid",
		dataIndex: "paid",
		key: "paid",
		render: (value: number) => <Slider value={value} fullLabel="Full" />,
	},
];

const Deals: NextPage = () => {
	const router = useRouter();
	const { marketplace } = router.query;
	const locales = useLocales();
	const client = useCredixClient();
	const maybeFetchMarket = useStore((state) => state.maybeFetchMarket);

	const market = useStore((state) => state.market);
	const [isLoadingDeals, setIsLoadingDeals] = useState<boolean>(true);
	const [activeDeals, setActiveDeals] = useState<Deal[]>([]);
	const [endedDeals, setEndedDeals] = useState<Deal[]>([]);

	useEffect(() => {
		maybeFetchMarket(client, marketplace as string);
	}, [client, maybeFetchMarket, marketplace]);

	const dealRepaidRatio = (principal: Big, principalAmountRepaid: Big) => {
		if (!principalAmountRepaid.toNumber()) {
			return 0;
		}

		return formatRatio(new Ratio(principal.toNumber(), principalAmountRepaid.toNumber()));
	};

	const mapDeal = useCallback(
		({ address, name, principal, goLiveAt, principalAmountRepaid }: Deal) => {
			return {
				key: address.toString(),
				name: name,
				amount: toUIAmount(principal).toNumber(),
				date: formatTimestamp(goLiveAt, locales as string[]),
				paid: dealRepaidRatio(principal, principalAmountRepaid),
			};
		},
		[locales]
	);

	const getDeals = useCallback(async () => {
		setIsLoadingDeals(true);
		const deals = await market?.fetchDeals();

		if (!deals) {
			setIsLoadingDeals(false);
			return;
		}

		const { activeDeals, endedDeals } = deals?.reduce(
			(acc, deal) => {
				switch (deal.status) {
					case DealStatus.IN_PROGRESS:
						acc.activeDeals.push(mapDeal(deal));
					case DealStatus.CLOSED:
						acc.endedDeals.push(mapDeal(deal));
					default:
						return acc;
				}
			},
			{ activeDeals: [], endedDeals: [] }
		);

		setActiveDeals(activeDeals);
		setEndedDeals(endedDeals);
		setIsLoadingDeals(false);
	}, [market, mapDeal]);

	useEffect(() => {
		getDeals();
	}, [getDeals]);

	return (
		<div className="space-y-14 py-5 px-4 md:pt-36 md:px-28">
			<div className="flex justify-between">
				<div></div>
				<Link href={`/${marketplace}/invest`}>
					<a>
						<Button size="large" icon={<Icon name="plus-square" />}>
							Invest
						</Button>
					</a>
				</Link>
			</div>
			<Tabs>
				<TabPane tab="Active Deals" key="1">
					<Table
						loading={isLoadingDeals}
						onRow={(record) => {
							return {
								onClick: () => {
									router.push(`/${marketplace}/deal/${record?.key}`);
								},
							};
						}}
						dataSource={activeDeals}
						columns={dealsTableColumns}
					/>
				</TabPane>
				<TabPane tab="Ended Deals" key="2">
					<Table loading={isLoadingDeals} dataSource={endedDeals} columns={dealsTableColumns} />
				</TabPane>
			</Tabs>
		</div>
	);
};

export default Deals;