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
import { useIntl } from "react-intl";

export const InvestWithdraw = () => {
	const router = useRouter();
	const { marketplace } = router.query;
	const client = useCredixClient();
	const maybeFetchMarket = useStore((state) => state.maybeFetchMarket);
	const fetchMarket = useStore((state) => state.fetchMarket);
	const market = useStore((state) => state.market);
	const intl = useIntl();

	useEffect(() => {
		maybeFetchMarket(client, marketplace as string);
	}, [client, maybeFetchMarket, marketplace]);

	const withdraw = async ({ amount }: LiquidityPoolInteractionForm) => {
		const formattedNumber = numberFormatter.format(amount);
		const hide = message.loading({
			content: intl.formatMessage(
				{
					defaultMessage: "Withdrawing {amount} USDC",
					description: "InvestWithdraw: withdraw loading",
				},
				{ amount: formattedNumber }
			),
		});

		try {
			await market.withdraw(toProgramAmount(new Big(amount)).toNumber());
			hide();
			message.success({
				content: intl.formatMessage(
					{
						defaultMessage: "Successfully withdrew {amount} USDC",
						description: "InvestWithdraw: withdraw success",
					},
					{ amount: formattedNumber }
				),
			});
			await fetchMarket(client, marketplace as string);
		} catch (error) {
			hide();
			message.error({
				content: intl.formatMessage(
					{
						defaultMessage: "Failed to withdraw {amount} USDC",
						description: "InvestWithdraw: withdraw failed",
					},
					{ amount: formattedNumber }
				),
			});
		}
	};

	const invest = async ({ amount }: LiquidityPoolInteractionForm) => {
		const formattedNumber = numberFormatter.format(amount);
		const hide = message.loading({
			content: intl.formatMessage(
				{
					defaultMessage: "Depositing {amount} USDC",
					description: "InvestWithdraw: deposit loading",
				},
				{ amount: formattedNumber }
			),
		});

		try {
			await market.deposit(toProgramAmount(new Big(amount)).toNumber());
			hide();
			message.success({
				content: intl.formatMessage(
					{
						defaultMessage: "Successfully deposited {amount} USDC",
						description: "InvestWithdraw: deposit success",
					},
					{ amount: formattedNumber }
				),
			});
			await fetchMarket(client, marketplace as string);
		} catch (error) {
			hide();
			message.error({
				content: intl.formatMessage(
					{
						defaultMessage: "Failed to deposit {amount} USDC",
						description: "InvestWithdraw: deposit failed",
					},
					{ amount: formattedNumber }
				),
			});
		}
	};

	return (
		<Tabs>
			<TabPane
				tab={intl.formatMessage({
					defaultMessage: "Invest",
					description: "InvestWithdraw: invest tab title",
				})}
				key="1"
			>
				<LiquidityPoolInteraction action="invest" onSubmit={invest} />
			</TabPane>
			<TabPane
				tab={intl.formatMessage({
					defaultMessage: "Withdraw",
					description: "InvestWithdraw: withdraw tab title",
				})}
				key="2"
			>
				<LiquidityPoolInteraction action="withdraw" onSubmit={withdraw} />
			</TabPane>
		</Tabs>
	);
};
