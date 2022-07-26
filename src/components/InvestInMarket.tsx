import React, { FunctionComponent } from "react";
import { LiquidityPoolInteraction, LPInteraction } from "@components/LiquidityPoolInteraction";
import { defineMessages, useIntl } from "react-intl";
import { compactFormatter, toProgramAmount } from "@utils/format.utils";
import message from "@message";
import Big from "big.js";
import notification from "@notification";
import { TokenAmount } from "@solana/web3.js";
import { Market } from "@credix/credix-client";
import { Icon, IconDimension } from "./Icon";

export const InvestInMarket: FunctionComponent<InvestInMarketProps> = ({
	balance,
	market,
	refreshMarket,
}) => {
	const intl = useIntl();

	const invest = async ({ amount }) => {
		const formattedNumber = compactFormatter.format(amount);
		const hide = message.loading({
			content: intl.formatMessage(MESSAGES.investLoading, { amount: formattedNumber }),
		});

		try {
			await market.deposit(toProgramAmount(Big(amount)).toNumber());
			hide();
			refreshMarket();
			notification.success({
				message: intl.formatMessage(MESSAGES.investSuccess, { amount: formattedNumber }),
			});
		} catch (error) {
			hide();
			notification.error({
				message: intl.formatMessage(MESSAGES.investFailure, { amount: formattedNumber }),
				error,
			});
		}
	};

	return (
		<div>
			<div className="font-sans text-3xl font-semibold mb-6 capitalize">
				{intl.formatMessage(MESSAGES.invest)}
			</div>
			<div className="border border-dashed border-black p-6 pb-16 rounded-md">
				<div>
					<div className="font-medium text-base">{intl.formatMessage(MESSAGES.yourBalance)}</div>
					<div className="font-normal text-xs text-neutral-60 mb-4">
						{intl.formatNumber(balance?.uiAmount, { useGrouping: true })} USDC
					</div>
					<LiquidityPoolInteraction
						action={LPInteraction.INVEST}
						icon={<Icon name="line-up" size={IconDimension.MIDDLE} />}
						onSubmit={invest}
						maxValue={balance?.uiAmount}
					/>
				</div>
			</div>
		</div>
	);
};

const MESSAGES = defineMessages({
	investLoading: {
		defaultMessage: "Depositing {amount} USDC",
		description: "InvestWithdraw: invest loading",
	},
	investSuccess: {
		defaultMessage: "Successfully deposited {amount} USDC",
		description: "InvestWithdraw: deposit success",
	},
	investFailure: {
		defaultMessage: "Failed to deposit {amount} USDC",
		description: "InvestWithdraw: deposit failed",
	},
	yourBalance: {
		defaultMessage: "Your balance",
		description: "invest-withdraw: your balance",
	},
	invest: {
		defaultMessage: "invest",
		description: "invest-withdraw: invest",
	},
});

interface InvestInMarketProps {
	balance: TokenAmount;
	market: Market;
	refreshMarket: () => void;
}
