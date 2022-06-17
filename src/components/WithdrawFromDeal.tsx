import React, { FunctionComponent, useEffect, useState } from "react";
import { useCredixClient } from "@credix/credix-client";
import { useIntl } from "react-intl";
import message from "@message";
import { toProgramAmount } from "@utils/format.utils";
import Big from "big.js";
import { useRouter } from "next/router";
import { useStore } from "@state/useStore";
import { DealInteraction } from "./DealInteraction";
import { DealWithNestedResources } from "@state/dealSlice";

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
			content: intl.formatMessage(
				{
					defaultMessage: "Withdrawing {amount} USDC",
					description: "Withdraw from deal: withdrawal loading",
				},
				{
					amount,
				}
			),
		});
		try {
			await deal.withdraw(toProgramAmount(Big(amount)).toNumber());
			hide();
			message.success({
				content: intl.formatMessage(
					{
						defaultMessage: "Successfully made withdrawal of {amount} USDC",
						description: "Withdraw from deal: withdrawal success",
					},
					{
						amount,
					}
				),
			});
			await fetchMarket(client, marketplace as string);
		} catch {
			hide();
			message.error({
				content: intl.formatMessage(
					{
						defaultMessage: "Failed to withdraw {amount} USDC",
						description: "Withdraw from deal: withdrawal failed",
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
			onSubmit={withdraw}
			icon="download"
			title={intl.formatMessage({
				defaultMessage: "Withdraw",
				description: "Withdraw from deal: title",
			})}
			maxAmount={withdrawableAmount}
			content={
				<>
					<div>
						{intl.formatMessage({
							defaultMessage: "Withdrawable amount",
							description: "Withdraw from deal: withdrawable amount",
						})}
					</div>
					<div>{withdrawableAmount} USDC</div>
				</>
			}
		/>
	);
};
interface WithdrawFromDealProps {
	deal: DealWithNestedResources;
}
