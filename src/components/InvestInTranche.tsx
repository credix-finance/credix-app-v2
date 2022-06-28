import React, { FunctionComponent, useCallback, useEffect, useState } from "react";
import { Icon, IconDimension } from "./Icon";
import { Button } from "./Button";
import { Input } from "./Input";
import { Form } from "antd";
import { Fraction, RepaymentSchedule, Tranche, useCredixClient } from "@credix/credix-client";
import { trancheNames, zeroTokenAmount } from "@consts";
import { ratioFormatter, toProgramAmount } from "@utils/format.utils";
import { useIntl } from "react-intl";
import { useWallet } from "@solana/wallet-adapter-react";
import { TokenAmount } from "@solana/web3.js";
import { AddMaxButtonSuffix } from "./AddMaxButtonSuffix";
import { useUserBaseBalance } from "@hooks/useUserBaseBalance";
import message from "@message";
import Big from "big.js";
import { useStore } from "@state/useStore";
import { useRouter } from "next/router";
import { TrancheFillLevel } from "./TrancheFillLevel";
import { config } from "@config";
import { SolanaCluster } from "@credix_types/solana.types";
import { investorProjectedReturns } from "@utils/tranche.utils";

interface InvestInTrancheProps {
	tranche: Tranche;
	repaymentSchedule: RepaymentSchedule;
}

export const InvestInTranche: FunctionComponent<InvestInTrancheProps> = ({
	tranche,
	repaymentSchedule,
}) => {
	const router = useRouter();
	const { marketplace } = router.query;
	const intl = useIntl();
	const [form] = Form.useForm();
	const { publicKey } = useWallet();
	const [userTrancheBalance, setUserTrancheBalance] = useState<TokenAmount>();
	const userBaseBalance = useUserBaseBalance();
	const client = useCredixClient();
	const fetchMarket = useStore((state) => state.fetchMarket);
	const projectedReturns = investorProjectedReturns(tranche, repaymentSchedule, userTrancheBalance);

	const getInvestorTranche = useCallback(async () => {
		if (tranche && publicKey) {
			try {
				const userTrancheBalance = await tranche.userTrancheBalance(publicKey);
				setUserTrancheBalance(userTrancheBalance);
				form.resetFields();
			} catch (error) {
				// User has not yet invested in tranche
				if (Object.hasOwn(error, "message") && error.message.includes("could not find account")) {
					setUserTrancheBalance(zeroTokenAmount);
				}
			}
		}
	}, [tranche, publicKey, form]);

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

	const investInTranche = async ({ amount }) => {
		const hide = message.loading({
			content: intl.formatMessage(
				{
					defaultMessage: "Investing {amount} USDC",
					description: "Invest in tranche: invest loading",
				},
				{ amount: amount }
			),
		});

		try {
			await maybeIssueTranchePass();
			await tranche.deposit(toProgramAmount(Big(amount)).toNumber());
			// Refresh market
			await fetchMarket(client, marketplace as string);
			hide();
			message.success({
				content: intl.formatMessage(
					{
						defaultMessage: "Successfully invested {amount} USDC",
						description: "Invest in tranche: invest success",
					},
					{
						amount,
					}
				),
			});
		} catch {
			hide();
			message.error({
				content: intl.formatMessage({
					defaultMessage: "Failed to invest in tranche",
					description: "Invest in tranche: invest request failed",
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
				<TrancheFillLevel
					amountDeposited={tranche.amountDeposited}
					size={tranche.size}
					trancheIndex={tranche.index}
				>
					<div className="absolute top-[50%] left-[50%] text-white">
						<div className="relative top-[-50%] left-[-50%]">
							{/* TODO: check precision of formatting */}
							{ratioFormatter.format(
								new Fraction(tranche.amountDeposited.uiAmount, tranche.size.uiAmount).toNumber()
							)}{" "}
							filled
						</div>
					</div>
				</TrancheFillLevel>
				<div className="flex flex-col justify-between">
					<div className="space-y-6">
						<div>
							<div className="font-mono font-bold text-base">
								{intl.formatMessage({
									defaultMessage: "Details",
									description: "Invest in tranche: details",
								})}
							</div>
							<div className="mt-4 grid grid-cols-layout gap-x-16 gap-y-1">
								<div className="font-mono font-normal text-sm">
									{intl.formatMessage({
										defaultMessage: "APR",
										description: "Invest in tranche: apr",
									})}
								</div>
								<div className="font-mono font-normal text-sm">
									{intl.formatMessage({
										defaultMessage: "Size",
										description: "Invest in tranche: size",
									})}
								</div>
								{/* TODO: get apr */}
								<div className="font-mono font-medium text-sm">15%</div>
								<div className="font-mono font-medium text-sm">{tranche.size.uiAmount} USDC</div>
							</div>
						</div>
						<div className="w-full h-[1px]  bg-neutral-105"></div>
						<div>
							<div className="font-mono font-bold text-base">
								{intl.formatMessage({
									defaultMessage: "Your investment",
									description: "Invest in tranche: your investment",
								})}
							</div>
							{/* TODO: hex color */} {/* TODO: spacing */}
							<div
								className={`font-mono font-normal text-sm space-x-2  flex mt-[14px] ${
									userTrancheBalance?.uiAmount === 0 ? "text-[#afafaf]" : "text-black"
								}`}
							>
								<div>
									{intl.formatMessage({
										defaultMessage: "Value",
										description: "Invest in tranche: value",
									})}
									:
								</div>
								<div>{userTrancheBalance?.uiAmountString} USDC</div>
							</div>
							<div className="font-mono font-normal text-sm space-x-2 text-[#afafaf] flex mt-[16px]">
								<div>
									{intl.formatMessage({
										defaultMessage: "Projected value",
										description: "Invest in tranche: projected value",
									})}
									:
								</div>
								{/* TODO: add projected value */}
								<div>{projectedReturns.toString()} USDC</div>
							</div>
						</div>
					</div>
					<div>
						{/* TODO: fix spacing caused by feedback */}
						<Form name="deal" form={form} onFinish={investInTranche} layout="vertical">
							<div className="flex space-x-4">
								{/* TODO: set max amount to balance */}
								<Input
									type="number"
									lang="en"
									step="1"
									label={intl.formatMessage({
										defaultMessage: "Invest In Tranche",
										description: "Invest in tranche: amount input label",
									})}
									className="bg-neutral-0"
									labelClassName="font-bold text-sm"
									placeholder={intl.formatMessage({
										defaultMessage: "Amount",
										description: "Invest in tranche: amount input placeholder",
									})}
									name="amount"
									description={intl.formatMessage(
										{
											defaultMessage: "Maximum amount: {amount} USDC",
											description: "Invest in tranche: amount input description",
										},
										{
											amount: userBaseBalance.uiAmountString,
										}
									)}
									suffix={
										<AddMaxButtonSuffix
											form={form}
											amount={Math.min(
												userBaseBalance.uiAmount,
												tranche.size.uiAmount - tranche.amountDeposited.uiAmount
											)}
										/>
									}
								/>
								<Form.Item className="mb-0" label={" "}>
									<Button
										htmlType="submit"
										icon={<Icon name="line-up" size={IconDimension.MIDDLE} />}
										className="w-full h-12 md:w-max capitalize"
									>
										{intl.formatMessage({
											defaultMessage: "invest",
											description: "Invest in tranche: amount form submit button text",
										})}
									</Button>
								</Form.Item>
							</div>
						</Form>
					</div>
				</div>
			</div>
		</div>
	);
};
