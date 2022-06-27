import React, { FunctionComponent } from "react";
import { useCredixClient } from "@credix/credix-client";
import { defineMessages, useIntl } from "react-intl";
import { useUserBaseBalance } from "@hooks/useUserBaseBalance";
import message from "@message";
import { toProgramAmount } from "@utils/format.utils";
import Big from "big.js";
import { useRouter } from "next/router";
import { useStore } from "@state/useStore";
import { DealInteraction } from "./DealInteraction";
import { FormInstance } from "antd";
import { validateMaxValue } from "@utils/validation.utils";
import { DealWithNestedResources } from "@state/dealSlice";
import { totalMissingAmount } from "@utils/deal.utils";

const MESSAGES = defineMessages({
	repayLoading: {
		defaultMessage: "Repaying {amount} USDC",
		description: "Repay deal: repayment loading",
	},
	repaySuccess: {
		defaultMessage: "Successfully made repayment of {amount} USDC",
		description: "Repay deal: repayment success",
	},
	repayFailure: {
		defaultMessage: "Failed to repay {amount} USDC",
		description: "Repay deal: repayment failed",
	},
	maxWalletValidationMessage: {
		defaultMessage: "'amount' cannot be greater than the amount in your wallet ({amount})",
		description: "Repay deal: max amount wallet validation message",
	},
	maxMissingAmountValidationMessage: {
		defaultMessage:
			"'amount' cannot be greater than the amount that still has to be repaid ({amount})",
		description: "Repay deal: max amount missing amount validation message",
	},
	repayTitle: {
		defaultMessage: "Repay",
		description: "Repay deal: title",
	},
	yourBalance: {
		defaultMessage: "Your balance",
		description: "Repay deal: your balance",
	},
});

export const RepayDeal: FunctionComponent<RepayDealProps> = ({ deal }) => {
	const router = useRouter();
	const { marketplace } = router.query;
	const client = useCredixClient();
	const fetchMarket = useStore((state) => state.fetchMarket);
	const intl = useIntl();
	const userBaseBalance = useUserBaseBalance();
	const missingAmount = totalMissingAmount(deal.repaymentSchedule);
	const maxAmount = Math.min(userBaseBalance.uiAmount, missingAmount);

	const repay = async ({ amount }, form: FormInstance) => {
		const hide = message.loading({
			content: intl.formatMessage(MESSAGES.repayLoading, {
				amount,
			}),
		});

		try {
			await deal.repay(toProgramAmount(Big(amount)).toNumber());
			hide();
			message.success({
				content: intl.formatMessage(MESSAGES.repaySuccess, {
					amount,
				}),
			});
			form.resetFields();
			await fetchMarket(client, marketplace as string);
		} catch {
			hide();
			message.error({
				content: intl.formatMessage(MESSAGES.repayFailure, {
					amount,
				}),
			});
		}
	};

	const validateMaxAmount = (value): Promise<void> => {
		const maxWalletValidationMessage = intl.formatMessage(MESSAGES.maxWalletValidationMessage, {
			amount: maxAmount,
		});
		const maxMissingAmountValidationMessage = intl.formatMessage(
			MESSAGES.maxMissingAmountValidationMessage,
			{
				amount: maxAmount,
			}
		);

		const validationMessage =
			maxAmount === missingAmount ? maxMissingAmountValidationMessage : maxWalletValidationMessage;

		return validateMaxValue(value, maxAmount, validationMessage);
	};

	return (
		<DealInteraction
			onSubmit={repay}
			icon="circle-and-square"
			title={intl.formatMessage(MESSAGES.repayTitle)}
			maxAmount={maxAmount}
			validationRules={[
				{
					validator(_, value) {
						return validateMaxAmount(value);
					},
				},
			]}
			content={
				<>
					<div className="font-medium text-base">{intl.formatMessage(MESSAGES.yourBalance)}</div>
					<div className="font-normal text-xs">{userBaseBalance.uiAmount} USDC</div>
				</>
			}
		/>
	);
};
interface RepayDealProps {
	deal: DealWithNestedResources;
}
