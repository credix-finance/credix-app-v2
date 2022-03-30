import React, { useEffect } from "react";
import { useCredixClient } from "@credix/credix-client";
import {
	LiquidityPoolInteraction,
	LiquidityPoolInteractionForm,
} from "@components/LiquidityPoolInteraction";
import { TabPane } from "@components/TabPane";
import { Tabs } from "@components/Tabs";
import { Big } from "big.js";
import message from "../message";
import { useStore } from "state/useStore";
import { numberFormatter, toProgramAmount } from "@utils/format.utils";
import { useRouter } from "next/router";

export const InvestWithdraw = () => {
	const router = useRouter();
	const { marketplace } = router.query;
	const client = useCredixClient();
	const maybeFetchMarket = useStore((state) => state.maybeFetchMarket);
	const fetchMarket = useStore((state) => state.fetchMarket);
	const market = useStore((state) => state.market);

	useEffect(() => {
		maybeFetchMarket(client, marketplace as string);
	}, [client, maybeFetchMarket, marketplace]);

	const withdraw = async ({ amount }: LiquidityPoolInteractionForm) => {
		const formattedNumber = numberFormatter.format(amount);
		const hide = message.loading({ content: `Withdrawing ${formattedNumber} USDC` });

		try {
			await market.withdraw(toProgramAmount(new Big(amount)));
			hide();
			message.success({ content: `Successfully withdrew ${formattedNumber} USDC` });
			await fetchMarket(client, marketplace as string);
		} catch (error) {
			hide();
			message.error({ content: `Failed to withdraw ${formattedNumber} USDC` });
		}
	};

	const invest = async ({ amount }: LiquidityPoolInteractionForm) => {
		const formattedNumber = numberFormatter.format(amount);
		const hide = message.loading({ content: `Depositing ${formattedNumber} USDC` });

		try {
			await market.deposit(toProgramAmount(new Big(amount)));
			hide();
			message.success({ content: `Successfully deposited ${formattedNumber} USDC` });
			await fetchMarket(client, marketplace as string);
		} catch (error) {
			hide();
			message.error({ content: `Failed to deposit ${formattedNumber} USDC` });
		}
	};

	return (
		<Tabs>
			<TabPane tab="Invest" key="1">
				<LiquidityPoolInteraction action="invest" onSubmit={invest} />
			</TabPane>
			<TabPane tab="Withdraw" key="2">
				<LiquidityPoolInteraction action="withdraw" onSubmit={withdraw} />
			</TabPane>
		</Tabs>
	);
};
