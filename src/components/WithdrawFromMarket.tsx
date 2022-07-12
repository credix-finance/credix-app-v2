import React, { FunctionComponent } from "react";
import { LiquidityPoolInteraction, LPInteraction } from "@components/LiquidityPoolInteraction";
import { defineMessages, useIntl } from "react-intl";
import { compactFormatter, toProgramAmount } from "@utils/format.utils";
import message from "@message";
import Big from "big.js";
import notification from "@notification";
import { Market } from "@credix/credix-client";
import { Icon, IconDimension } from "@components/Icon";

export const WithdrawFromMarket: FunctionComponent<WithdrawFromMarketProps> = ({
	userStake,
	market,
	refreshMarket,
}) => {
	const intl = useIntl();

	const withdraw = async ({ amount }) => {
		const formattedNumber = compactFormatter.format(amount);
		const hide = message.loading({
			content: intl.formatMessage(MESSAGES.withdrawLoading, { amount: formattedNumber }),
		});

		try {
			await market.withdraw(toProgramAmount(Big(amount)).toNumber());
			hide();
			refreshMarket();
			notification.success({
				message: intl.formatMessage(MESSAGES.withdrawSuccess, { amount: formattedNumber }),
			});
		} catch (error) {
			hide();
			notification.error({
				message: intl.formatMessage(MESSAGES.withdrawFailure, { amount: formattedNumber }),
				error,
			});
		}
	};

	return (
		<div>
			<div className="font-sans text-3xl font-semibold mb-6 capitalize">
				{intl.formatMessage(MESSAGES.withdraw)}
			</div>
			<div className="border border-dashed border-black p-6 pb-16 rounded-md">
				<div>
					<div className="font-medium text-base">
						{intl.formatMessage(MESSAGES.withdrawableAmount)}
					</div>
					<div className="font-normal text-xs text-neutral-60 mb-4">
						{intl.formatNumber(userStake, { useGrouping: true })} USDC
					</div>
					<LiquidityPoolInteraction
						action={LPInteraction.WITHDRAW}
						onSubmit={withdraw}
						maxValue={userStake}
						icon={<Icon name="download" size={IconDimension.MIDDLE} />}
					/>
				</div>
			</div>
		</div>
	);
};

const MESSAGES = defineMessages({
	withdrawLoading: {
		defaultMessage: "Withdrawing {amount} USDC",
		description: "InvestWithdraw: withdraw loading",
	},
	withdrawSuccess: {
		defaultMessage: "Successfully withdrew {amount} USDC",
		description: "InvestWithdraw: withdraw success",
	},
	withdrawFailure: {
		defaultMessage: "Failed to withdraw {amount} USDC",
		description: "InvestWithdraw: withdraw failed",
	},
	withdraw: {
		defaultMessage: "withdraw",
		description: "invest-withdraw: withdraw",
	},
	withdrawableAmount: {
		defaultMessage: "Withdrawalble amount",
		description: "invest-withdraw: withdrawable amount",
	},
});

interface WithdrawFromMarketProps {
	userStake: number;
	market: Market;
	refreshMarket: () => void;
}
