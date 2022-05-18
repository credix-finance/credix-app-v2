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
import notification from "notification";

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

	const refreshMarketStats = async () => {
		try {
			await fetchMarket(client, marketplace as string);
		} catch {
			notification.error({
				message: intl.formatMessage({
					defaultMessage: "Failed to refresh market stats",
					description: "InvestWithdraw: refresh market failed",
				}),
			});
		}
	};

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
			notification.success({
				message: intl.formatMessage(
					{
						defaultMessage: "Successfully withdrew {amount} USDC",
						description: "InvestWithdraw: withdraw success",
					},
					{ amount: formattedNumber }
				),
			});
			refreshMarketStats();
		} catch (error) {
			hide();
			notification.error({
				message: intl.formatMessage(
					{
						defaultMessage: "Failed to withdraw {amount} USDC",
						description: "InvestWithdraw: withdraw failed",
					},
					{ amount: formattedNumber }
				),
				error,
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
			notification.success({
				message: intl.formatMessage(
					{
						defaultMessage: "Successfully deposited {amount} USDC",
						description: "InvestWithdraw: deposit success",
					},
					{ amount: formattedNumber }
				),
			});
			refreshMarketStats();
		} catch (error) {
			hide();
			notification.error({
				message: intl.formatMessage(
					{
						defaultMessage: "Failed to deposit {amount} USDC",
						description: "InvestWithdraw: deposit failed",
					},
					{ amount: formattedNumber }
				),
				error,
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
