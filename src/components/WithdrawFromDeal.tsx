import React, { FunctionComponent, useEffect, useState } from "react";
import { useCredixClient } from "@credix/credix-client";
import { defineMessages, useIntl } from "react-intl";
import message from "@message";
import { toProgramAmount } from "@utils/format.utils";
import Big from "big.js";
import { useRouter } from "next/router";
import { useStore } from "@state/useStore";
import { DealInteraction } from "./DealInteraction";
import { DealWithNestedResources } from "@state/dealSlice";
import { validateMaxValue } from "@utils/validation.utils";

const MESSAGES = defineMessages({
	maxAmountValidation: {
		defaultMessage: "'amount' cannot be greater than or equal to {amount} USDC",
		description: "Withdraw from deal: max amount validation message",
	},
	withdrawLoading: {
		defaultMessage: "Withdrawing {amount} USDC",
		description: "Withdraw from deal: withdrawal loading",
	},
	withdrawSuccess: {
		defaultMessage: "Successfully made withdrawal of {amount} USDC",
		description: "Withdraw from deal: withdrawal success",
	},
	withdrawFailure: {
		defaultMessage: "Failed to withdraw {amount} USDC",
		description: "Withdraw from deal: withdrawal failed",
	},
	withdrawTitle: {
		defaultMessage: "Withdraw",
		description: "Withdraw from deal: title",
	},
	withdrawableAmount: {
		defaultMessage: "Withdrawable amount",
		description: "Withdraw from deal: withdrawable amount",
	},
});

export const WithdrawFromDeal: FunctionComponent<WithdrawFromDealProps> = ({ deal }) => {
	const router = useRouter();
	const { marketplace } = router.query;
	const client = useCredixClient();
	const fetchMarket = useStore((state) => state.fetchMarket);
	const intl = useIntl();
	const [withdrawableAmount, setWithdrawableAmount] = useState<number>(0);

	useEffect(() => {
		if (deal) {
			const withdrawableAmount =
				deal.repaymentSchedule.totalPrincipal.uiAmount - deal.amountWithdrawn.uiAmount;
			setWithdrawableAmount(withdrawableAmount);
		}
	}, [deal]);

	const withdraw = async ({ amount }) => {
		const hide = message.loading({
			content: intl.formatMessage(MESSAGES.withdrawLoading, {
				amount,
			}),
		});
		try {
			await deal.withdraw(toProgramAmount(Big(amount)).toNumber());
			hide();
			message.success({
				content: intl.formatMessage(MESSAGES.withdrawSuccess, {
					amount,
				}),
			});
			await fetchMarket(client, marketplace as string);
		} catch {
			hide();
			message.error({
				content: intl.formatMessage(MESSAGES.withdrawFailure, {
					amount,
				}),
			});
		}
	};

	const validateMaxAmount = (value): Promise<void> => {
		const validationMessage = intl.formatMessage(MESSAGES.maxAmountValidation, {
			amount: withdrawableAmount,
		});

		return validateMaxValue(value, withdrawableAmount, validationMessage);
	};

	return (
		<DealInteraction
			onSubmit={withdraw}
			icon="download"
			title={intl.formatMessage(MESSAGES.withdrawTitle)}
			maxAmount={withdrawableAmount}
			validationRules={[
				{
					validator(_, value) {
						return validateMaxAmount(value);
					},
				},
			]}
			content={
				<>
					<div>{intl.formatMessage(MESSAGES.withdrawableAmount)}</div>
					<div>{withdrawableAmount} USDC</div>
				</>
			}
		/>
	);
};
interface WithdrawFromDealProps {
	deal: DealWithNestedResources;
}
