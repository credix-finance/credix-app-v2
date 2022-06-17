import React, { FunctionComponent } from "react";
import { Deal, useCredixClient } from "@credix/credix-client";
import { useIntl } from "react-intl";
import { useUserBaseBalance } from "@hooks/useUserBaseBalance";
import message from "@message";
import { toProgramAmount } from "@utils/format.utils";
import Big from "big.js";
import { useRouter } from "next/router";
import { useStore } from "@state/useStore";
import { DealInteraction } from "./DealInteraction";
import { FormInstance } from "antd";

export const RepayDeal: FunctionComponent<RepayDealProps> = ({ deal }) => {
	const router = useRouter();
	const { marketplace } = router.query;
	const client = useCredixClient();
	const fetchMarket = useStore((state) => state.fetchMarket);
	const intl = useIntl();
	const userBaseBalance = useUserBaseBalance();

	const repay = async ({ amount }, form: FormInstance) => {
		const hide = message.loading({
			content: intl.formatMessage(
				{
					defaultMessage: "Repaying {amount} USDC",
					description: "Repay deal: repayment loading",
				},
				{
					amount,
				}
			),
		});

		try {
			await deal.repay(toProgramAmount(Big(amount)).toNumber());
			hide();
			message.success({
				content: intl.formatMessage(
					{
						defaultMessage: "Successfully made repayment of {amount} USDC",
						description: "Repay deal: repayment success",
					},
					{
						amount,
					}
				),
			});
			form.resetFields();
			await fetchMarket(client, marketplace as string);
		} catch {
			hide();
			message.error({
				content: intl.formatMessage(
					{
						defaultMessage: "Failed to repay {amount} USDC",
						description: "Repay deal: repayment failed",
					},
					{
						amount,
					}
				),
			});
		}
	};

	return (
		<DealInteraction
			onSubmit={repay}
			icon="circle-and-square"
			title={intl.formatMessage({
				defaultMessage: "Repay",
				description: "Repay deal: title",
			})}
			maxAmount={userBaseBalance.uiAmount}
			content={
				<>
					<div className="font-medium text-base">
						{intl.formatMessage({
							defaultMessage: "Your balance",
							description: "Repay deal: your balance",
						})}
					</div>
					<div className="font-normal text-xs">{userBaseBalance.uiAmount} USDC</div>
				</>
			}
		/>
	);
};
interface RepayDealProps {
	deal: Deal;
}
