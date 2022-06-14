import React, { FunctionComponent, useCallback, useEffect, useState } from "react";
import { Icon, IconDimension } from "./Icon";
import { Button } from "./Button";
import { Input } from "./Input";
import { Form } from "antd";
import { Fraction, Tranche } from "@credix/credix-client";
import { trancheFillColors, trancheNames, zeroTokenAmount } from "@consts";
import { ratioFormatter } from "@utils/format.utils";
import { useIntl } from "react-intl";
import { useWallet } from "@solana/wallet-adapter-react";
import { TokenAmount } from "@solana/web3.js";
import { AddMaxButtonSuffix } from "./AddMaxButtonSuffix";
import { useUserBaseBalance } from "@hooks/useUserBaseBalance";
import message from "@message";

export const TrancheFillLevel: FunctionComponent<TrancheFillLevelProps> = ({
	size,
	amountDeposited,
	trancheIndex,
}) => {
	const heightInPx = 400;
	const [filledHeightInPx, setFilledHeightInPx] = useState(0);
	const [unFilledHeightInPx, setUnFilledHeightInPx] = useState(0);
	const [amountDepositedPercentage, setAmountDepositedPercentage] = useState<Fraction>();

	useEffect(() => {
		setAmountDepositedPercentage(new Fraction(amountDeposited.uiAmount, size.uiAmount));
	}, [amountDeposited, size]);

	useEffect(() => {
		if (amountDepositedPercentage) {
			setFilledHeightInPx(amountDepositedPercentage.apply(heightInPx).toNumber());
		}
	}, [amountDepositedPercentage]);

	useEffect(() => {
		setUnFilledHeightInPx(heightInPx - filledHeightInPx);
	}, [filledHeightInPx]);

	return (
		<div className={`w-[400px] h-[${heightInPx}px] relative`}>
			<div
				className="w-full"
				style={{
					backgroundColor: trancheFillColors[trancheIndex - 1].unfilled,
					height: unFilledHeightInPx,
				}}
			></div>
			<div
				className="w-full"
				style={{
					backgroundColor: trancheFillColors[trancheIndex - 1].filled,
					height: filledHeightInPx,
				}}
			></div>
			<div className="absolute top-[50%] left-[50%] text-white">
				<div className="relative top-[-50%] left-[-50%]">
					{/* TODO: check precision of formatting */}
					{ratioFormatter.format(amountDepositedPercentage?.toNumber())} filled
				</div>
			</div>
		</div>
	);
};
interface TrancheFillLevelProps {
	amountDeposited: Tranche["amountDeposited"];
	size: Tranche["size"];
	trancheIndex: Tranche["index"];
}

interface InvestInTrancheProps {
	tranche: Tranche;
}

export const InvestInTranche: FunctionComponent<InvestInTrancheProps> = ({ tranche }) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { publicKey } = useWallet();
	const [userTrancheBalance, setUserTrancheBalance] = useState<TokenAmount>();
	const userBaseBalance = useUserBaseBalance();

	const getInvestorTranche = useCallback(async () => {
		if (tranche && publicKey) {
			try {
				const userTrancheBalance = await tranche.userTrancheBalance(publicKey);
				setUserTrancheBalance(userTrancheBalance);
			} catch (error) {
				// User has not yet invested in tranche
				if (Object.hasOwn(error, "message") && error.message.includes("could not find account")) {
					setUserTrancheBalance(zeroTokenAmount);
				}
			}
		}
	}, [tranche, publicKey]);

	useEffect(() => {
		getInvestorTranche();
	}, [getInvestorTranche]);

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
			// TODO: check how and when passes are created
			await tranche.issuePass(publicKey);
			await tranche.deposit(amount);
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
				/>
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
							<div className="font-mono font-normal text-sm space-x-2 text-[#afafaf] flex mt-[14px]">
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
								<div>0 USDC</div>
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
									suffix={<AddMaxButtonSuffix form={form} />}
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
