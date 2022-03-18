import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import { Deal, Ratio, useCredixClient } from "@credix/credix-client";
import { toUIAmount, formatRatio, formatTimestamp } from "../../utils/format.utils";
import { Tabs } from "@components/Tabs";
import { TabPane } from "@components/TabPane";
import { Table } from "@components/Table";
import { Icon, IconName } from "@components/Icon";
import { Slider } from "@components/Slider";
import { Button } from "@components/Button";
import Link from "next/link";
import Big from "big.js";
import { useLocales } from "../../hooks/useLocales";
import { useStore } from "@state/useStore";
import { useWallet } from "@solana/wallet-adapter-react";
import { config } from "config";

const dealsTableColumns = [
	{
		title: "Name",
		icon: "stacked-column-down" as IconName,
		dataIndex: "name",
		key: "name",
	},
	{
		title: "Amount",
		icon: "coins-alt" as IconName,
		dataIndex: "amount",
		key: "amount",
		render: (text) => <span className="font-medium text-lg">{text} USDC</span>,
	},
	{
		title: "Date",
		icon: "calendar" as IconName,
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
	const locales = useLocales();
	const { publicKey } = useWallet();
	const { marketplace } = router.query;
	const client = useCredixClient();
	const maybeFetchDeals = useStore((state) => state.maybeFetchDeals);
	const activeDeals = useStore((state) => state.activeDeals);
	const endedDeals = useStore((state) => state.endedDeals);
	const isLoadingDeals = useStore((state) => state.isLoadingDeals);

	useEffect(() => {
		maybeFetchDeals(client, marketplace as string);
	}, [client, maybeFetchDeals, marketplace]);

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

	return (
		<div className="space-y-14 py-5 px-4 md:pt-36 md:px-28">
			<h1>My Deals</h1>
			<Tabs>
				<TabPane tab="Active Deals" key="activeDealsTab">
					<Table
						loading={isLoadingDeals}
						onRow={(record) => {
							return {
								onClick: () => {
									router.push(`/${marketplace}/deals/${record?.key}/repay`);
								},
							};
						}}
						dataSource={activeDeals?.map((deal) => mapDeal(deal))}
						columns={dealsTableColumns}
					/>
				</TabPane>
				<TabPane tab="Ended Deals" key="endedDealsTab">
					<Table
						loading={isLoadingDeals}
						dataSource={endedDeals?.map((deal) => mapDeal(deal))}
						columns={dealsTableColumns}
					/>
				</TabPane>
			</Tabs>
		</div>
	);
};

export default Deals;
