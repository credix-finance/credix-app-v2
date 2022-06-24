import React, { FunctionComponent, useCallback, useEffect, useState } from "react";
import { Icon, IconDimension } from "./Icon";
import { Button } from "./Button";
import { Input } from "./Input";
import { Form } from "antd";
import { Tranche, useCredixClient } from "@credix/credix-client";
import { trancheNames, zeroTokenAmount } from "@consts";
import { round, toProgramAmount } from "@utils/format.utils";
import { useIntl } from "react-intl";
import { useWallet } from "@solana/wallet-adapter-react";
import { TokenAmount } from "@solana/web3.js";
import { AddMaxButtonSuffix } from "./AddMaxButtonSuffix";
import message from "@message";
import Big from "big.js";
import { useStore } from "@state/useStore";
import { useRouter } from "next/router";
import { TrancheFillLevel } from "./TrancheFillLevel";
import { config } from "@config";
import { SolanaCluster } from "@credix_types/solana.types";
import {
	calculateInvestorPercentageOfTranche,
	investorCurrentReturns,
	investorProjectedReturns,
} from "@utils/tranche.utils";
import { DealWithNestedResources } from "@state/dealSlice";

interface TrancheInvestmentProps {
	tranche: Tranche;
	userTrancheBalance: TokenAmount;
	deal: DealWithNestedResources;
}

export const TrancheInvestment: FunctionComponent<TrancheInvestmentProps> = ({
	tranche,
	deal,
	userTrancheBalance,
}) => {
	const router = useRouter();
	const { marketplace } = router.query;
	const intl = useIntl();
	const [form] = Form.useForm();
	const { publicKey } = useWallet();
	const [amountWithdrawn, setAmountWithdrawn] = useState<TokenAmount>(zeroTokenAmount);
	const [withdrawableAmount, setWithdrawableAmount] = useState<Big>(Big(0));
	const [projectedReturns, setProjectedReturns] = useState<Big>(Big(0));
	const [currentReturns, setCurrentReturns] = useState<Big>(Big(0));
	const [currentValue, setCurrentValue] = useState<Big>(Big(0));

	const client = useCredixClient();
	const fetchMarket = useStore((state) => state.fetchMarket);

	const getInvestorTranche = useCallback(async () => {
		if (tranche && publicKey) {
			let investorTranche = null;
			try {
				investorTranche = await tranche.fetchInvestorTranche(publicKey);
				setAmountWithdrawn(investorTranche.amountWithdrawn);
			} catch (error) {
				// User has not yet withdrawn from tranche
				console.log(error);
			}

			const userInvestmentPercentage = calculateInvestorPercentageOfTranche(
				tranche,
				userTrancheBalance
			);
			const userAvailable = userInvestmentPercentage.apply(tranche.totalRepaid.uiAmount);

			if (investorTranche?.amountWithdrawn.uiAmount) {
				setWithdrawableAmount(userAvailable.minus(investorTranche.amountWithdrawn.uiAmount));
			} else if (userAvailable) {
				setWithdrawableAmount(userAvailable);
			}
		}
	}, [tranche, publicKey, userTrancheBalance]);

	useEffect(() => {
		if (tranche && deal && userTrancheBalance) {
			const projectedReturns = investorProjectedReturns(
				tranche,
				deal.repaymentSchedule,
				userTrancheBalance,
				deal.interestFee
			);
			const roundedProjectedReturns = round(projectedReturns, Big.roundDown, 0);
			setProjectedReturns(roundedProjectedReturns);

			const currentReturns = investorCurrentReturns(tranche, userTrancheBalance);
			const roundedCurrentReturns = round(currentReturns, Big.roundDown, 0);
			setCurrentReturns(roundedCurrentReturns);
		}
	}, [tranche, deal, userTrancheBalance]);

	useEffect(() => {
		if (userTrancheBalance && currentReturns && amountWithdrawn) {
			const currentValue =
				userTrancheBalance.uiAmount + currentReturns.toNumber() - amountWithdrawn.uiAmount;
			const roundedCurrentValue = round(currentValue, Big.roundUp, 0);
			setCurrentValue(roundedCurrentValue);
		}
	}, [userTrancheBalance, currentReturns, amountWithdrawn]);

	useEffect(() => {
		getInvestorTranche();
	}, [getInvestorTranche]);

	const maybeIssueTranchePass = async () => {
		if (config.clusterConfig.name === SolanaCluster.LOCALNET) {
			const tranchePass = await tranche.fetchPass(publicKey);

			if (tranchePass === null) {
				await tranche.issuePass(publicKey);
			}
		}
	};

	const withdrawFromTranche = async ({ amount }) => {
		const hide = message.loading({
			content: intl.formatMessage(
				{
					defaultMessage: "Withdrawing {amount} USDC",
					description: "Withdraw from tranche: withdraw investment loading",
				},
				{ amount: amount }
			),
		});

		try {
			await maybeIssueTranchePass();
			await tranche.withdraw(toProgramAmount(Big(amount)).toNumber());
			// Refresh market
			await fetchMarket(client, marketplace as string);
			hide();
			message.success({
				content: intl.formatMessage(
					{
						defaultMessage: "Successfully withdrew {amount} USDC",
						description: "Withdraw from tranche: withdraw investment success",
					},
					{
						amount,
					}
				),
			});
			form.resetFields();
		} catch {
			hide();
			message.error({
				content: intl.formatMessage({
					defaultMessage: "Failed to withdraw from tranche",
					description: "Withdraw from tranche: withdraw investment request failed",
				}),
			});
		}
	};

	return (
		<div className="bg-neutral-0 p-10 border border-dashed border-neutral-40">
			<div className="font-sans font-semibold text-3xl capitalize">
				{trancheNames[tranche.index]}
			</div>
			<div className="mt-8 flex gap-x-12">
				{/* TODO: move content to children */}
				<TrancheFillLevel
					amountDeposited={tranche.amountDeposited}
					size={tranche.size}
					trancheIndex={tranche.index}
				>
					<div className="absolute top-8 left-8 text-neutral-0 font-normal text-lg font-mono">
						{intl.formatMessage(
							{
								defaultMessage: "Invested: {amount} {currency}",
								description: "Tranche investment: tranche fill level invested amount",
							},
							{
								amount: round(userTrancheBalance.uiAmountString, Big.roundUp, 0).toString(),
								currency: "USDC",
							}
						)}
					</div>
					<div className="absolute bottom-8 left-8 text-neutral-0 font-normal text-lg font-mono">
						{/* TODO: add apr */}
						APR: 15%
					</div>
				</TrancheFillLevel>
				<div>
					<div className="space-y-6">
						<div>
							<div className="font-mono font-bold text-base">
								{intl.formatMessage({
									defaultMessage: "Your investment",
									description: "Tranche investment: your investment",
								})}
							</div>
							<div className="grid grid-cols-2 mt-4 gap-y-4">
								<div>
									<div className="font-normal text-sm font-mono">
										{intl.formatMessage({
											defaultMessage: "Invested",
											description: "Tranche investment: invested label",
										})}
									</div>
									<div className="font-bold text-sm font-mono mt-2">
										{round(userTrancheBalance.uiAmountString, Big.roundUp, 0).toString()} USDC
									</div>
								</div>
								<div>
									<div>
										{intl.formatMessage({
											defaultMessage: "Projected returns",
											description: "Tranche investment: projected returns label",
										})}
									</div>
									<div className="font-bold text-sm font-mono mt-2">
										{projectedReturns.toString()} USDC
									</div>
								</div>
								<div>
									<div className="font-normal text-sm font-mono">
										{intl.formatMessage({
											defaultMessage: "Current value",
											description: "Tranche investment: current value label",
										})}
									</div>
									<div className="font-bold text-sm font-mono mt-2">
										{currentValue.toString()} USDC
									</div>
								</div>
								<div>
									<div className="font-normal text-sm font-mono">
										{intl.formatMessage({
											defaultMessage: "Current returns",
											description: "Tranche investment: current returns label",
										})}
									</div>
									<div className="font-bold text-sm font-mono mt-2">
										{currentReturns.toString()} USDC
									</div>
								</div>
							</div>
						</div>
						<div className="w-full h-[1px] bg-neutral-105 my-8"></div>
					</div>
					<div>
						{/* TODO: fix spacing caused by feedback */}
						<Form name="deal" form={form} onFinish={withdrawFromTranche} layout="vertical">
							<div className="flex space-x-4">
								{/* TODO: set max amount to balance */}
								<Input
									type="number"
									lang="en"
									step="1"
									label={" "}
									className="bg-neutral-0"
									labelClassName="font-bold text-sm"
									placeholder={intl.formatMessage({
										defaultMessage: "Amount",
										description: "Tranche investment: amount input placeholder",
									})}
									name="amount"
									suffix={<AddMaxButtonSuffix form={form} amount={withdrawableAmount.toNumber()} />}
								/>
								<Form.Item className="mb-0" label={" "}>
									<Button
										htmlType="submit"
										// TODO: use correct icon
										icon={<Icon name="line-up" size={IconDimension.MIDDLE} />}
										className="w-full h-12 md:w-max capitalize"
									>
										{intl.formatMessage({
											defaultMessage: "withdraw",
											description: "Tranche investment: withdraw form submit button text",
										})}
									</Button>
								</Form.Item>
							</div>
						</Form>
						<div className="grid grid-cols-2">
							<div>
								<div className="font-normal text-sm font-mono">
									{intl.formatMessage({
										defaultMessage: "Withdrawable",
										description: "Tranche investment: withdrawable amount label",
									})}
								</div>
								<div className="mt-2 font-bold text-sm">{withdrawableAmount.toString()} USDC</div>
							</div>
							<div>
								<div className="font-normal text-sm font-mono">
									{intl.formatMessage({
										defaultMessage: "Withdrawn",
										description: "Tranche investment: amount withdrawn label",
									})}
								</div>
								<div className="mt-2 font-bold text-sm">
									{round(amountWithdrawn.uiAmount, Big.roundHalfEven, 0).toString()} USDC
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
