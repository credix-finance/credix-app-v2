import React, { useCallback, useEffect, useState } from "react";
import { Market, useCredixClient } from "@credix/credix-client";
import {
	LiquidityPoolInteraction,
	LiquidityPoolInteractionForm,
} from "@components/LiquidityPoolInteraction";
import { TabPane } from "@components/TabPane";
import { Tabs } from "@components/Tabs";
import { defaultMarketplace } from "../consts";
import { Big } from "big.js";
import message from "../message";

export const InvestWithdraw = () => {
	const client = useCredixClient();
	const [market, setMarket] = useState<Market | null>(null);

	const getMarket = useCallback(async () => {
		const market = await client.fetchMarket(defaultMarketplace);
		setMarket(market);
	}, [client]);

	useEffect(() => {
		getMarket();
	}, []);

	// TODO: hook this up with to the client
	const withdraw = async ({ amount }: LiquidityPoolInteractionForm) => {
		const hide = message.loading({ content: `Withdrawing ${amount} USDC` });

		try {
			await market.withdraw(new Big(amount));
			hide();
			message.success({ content: `Sucessfully withdrew ${amount} USDC` });
		} catch (error) {
			hide();
			message.error({ content: `Failed to withdraw ${amount} USDC` });
		}
	};

	const invest = async ({ amount }: LiquidityPoolInteractionForm) => {
		const hide = message.loading({ content: `Depositing ${amount} USDC` });

		try {
			await market.deposit(new Big(amount));
			hide();
			message.success({ content: `Sucessfully deposited ${amount} USDC` });
		} catch (error) {
			hide();
			message.error({ content: `Failed to deposit ${amount} USDC` });
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
