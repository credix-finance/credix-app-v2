import React, { FunctionComponent, useCallback, useEffect, useState } from "react";
import { Icon, IconDimension } from "./Icon";
import { Button } from "./Button";
import { Input } from "./Input";
import { Form } from "antd";
import { Fraction, Tranche, useCredixClient, TranchePass } from "@credix/credix-client";
import { trancheNames, zeroTokenAmount } from "@consts";
import { ratioFormatter, toProgramAmount } from "@utils/format.utils";
import { defineMessages, useIntl } from "react-intl";
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
import { validateMaxValue, validateMinValue } from "@utils/validation.utils";
import { DealWithNestedResources } from "@state/dealSlice";

interface InvestInTrancheProps {
	tranche: Tranche;
	deal: DealWithNestedResources;
}

export const InvestInTranche: FunctionComponent<InvestInTrancheProps> = ({ tranche, deal }) => {
	const router = useRouter();
	const { marketplace } = router.query;
	const intl = useIntl();
	const [form] = Form.useForm();
	const { publicKey } = useWallet();
	const [userTrancheBalance, setUserTrancheBalance] = useState<TokenAmount>();
	const userBaseBalance = useUserBaseBalance();
	const client = useCredixClient();
	const fetchMarket = useStore((state) => state.fetchMarket);
	const projectedReturns = investorProjectedReturns(
		tranche,
		deal.repaymentSchedule,
		userTrancheBalance,
		deal.interestFee
	);
	const projectedValue = projectedReturns.add(userTrancheBalance?.uiAmount || 0);
	const maxInvestmentAmount = Math.min(
		userBaseBalance?.uiAmount,
		tranche.size.uiAmount - tranche.amountDeposited.uiAmount
	);
	const [tranchePass, setTranchePass] = useState<TranchePass | null>();

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

	useEffect(() => {
		const getTranchePass = async () => {
			if (tranche && publicKey) {
				const tranchePass = await tranche.fetchPass(publicKey);
				setTranchePass(tranchePass);
				form.validateFields(["amount"]);
			}
		};

		getTranchePass();
	}, [tranche, publicKey, form]);

	const maybeIssueTranchePass = async () => {
		if (config.clusterConfig.name === SolanaCluster.LOCALNET) {
			if (tranchePass === null) {
				await tranche.issuePass(publicKey);
			}
		}
	};

	const investInTranche = async ({ amount }) => {
		const hide = message.loading({
			content: intl.formatMessage(MESSAGES.investLoading, { amount: amount }),
		});

		try {
			await maybeIssueTranchePass();
			await tranche.deposit(toProgramAmount(Big(amount)).toNumber());
			// Refresh market
			await fetchMarket(client, marketplace as string);
			hide();
			message.success({
				content: intl.formatMessage(MESSAGES.investSuccess, {
					amount,
				}),
			});
		} catch {
			hide();
			message.error({
				content: intl.formatMessage(MESSAGES.investFailure),
			});
		}
	};

	const validateMinAmount = (value): Promise<void> => {
		const minAmount = 0;
		const validationMessage = intl.formatMessage(MESSAGES.minInvestmentAmountValidation, {
			amount: minAmount,
		});
		return validateMinValue(value, minAmount, validationMessage);
	};

	const validateMaxAmount = (value): Promise<void> => {
		const validationMessage = intl.formatMessage(MESSAGES.maxInvestmentAmountValidation, {
			amount: maxInvestmentAmount,
		});
		return validateMaxValue(value, maxInvestmentAmount, validationMessage);
	};

	const validateTranchePass = (): Promise<void> => {
		// Don't do validation on localnet as we issue passes on the fly
		if (config.clusterConfig.name === SolanaCluster.LOCALNET) {
			// Do nothing
			return Promise.resolve();
		}

		if (tranchePass === null) {
			return Promise.reject(intl.formatMessage(MESSAGES.tranchePassRequired));
		}

		if (!tranchePass.active) {
			return Promise.reject(intl.formatMessage(MESSAGES.activeTranchePassRequired));
		}

		// There is a tranche pass and it is active
		return Promise.resolve();
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
				<div className="flex flex-col justify-between max-w-[550px]">
					<div className="space-y-6">
						<div>
							<div className="font-mono font-bold text-base">
								{intl.formatMessage(MESSAGES.details)}
							</div>
							<div className="mt-4 grid grid-cols-layout gap-x-16 gap-y-1">
								<div className="font-mono font-normal text-sm">
									{intl.formatMessage(MESSAGES.details)}
								</div>
								<div className="font-mono font-normal text-sm">
									{intl.formatMessage(MESSAGES.size)}
								</div>
								{/* TODO: get apr */}
								<div className="font-mono font-medium text-sm">15%</div>
								<div className="font-mono font-medium text-sm">{tranche.size.uiAmount} USDC</div>
							</div>
						</div>
						<div className="w-full h-[1px]  bg-neutral-105"></div>
						<div>
							<div className="font-mono font-bold text-base">
								{intl.formatMessage(MESSAGES.yourInvestment)}
							</div>
							{/* TODO: hex color */} {/* TODO: spacing */}
							<div
								className={`font-mono font-normal text-sm space-x-2  flex mt-[14px] ${
									userTrancheBalance?.uiAmount === 0 ? "text-[#afafaf]" : "text-black"
								}`}
							>
								<div>{intl.formatMessage(MESSAGES.value)}:</div>
								<div>{userTrancheBalance?.uiAmountString} USDC</div>
							</div>
							<div className="font-mono font-normal text-sm space-x-2 text-[#afafaf] flex mt-[16px]">
								<div>{intl.formatMessage(MESSAGES.projectedValue)}:</div>
								{/* TODO: add projected value */}
								<div>{projectedValue.toString()} USDC</div>
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
									label={intl.formatMessage(MESSAGES.investAmountInputLabel)}
									className="bg-neutral-0"
									labelClassName="font-bold text-sm mb-0"
									placeholder={intl.formatMessage(MESSAGES.investAmountInputPlaceholder)}
									name="amount"
									description={intl.formatMessage(MESSAGES.investAmountInputDescription, {
										amount: maxInvestmentAmount,
									})}
									required={true}
									rules={[
										{
											required: true,
											message: intl.formatMessage(MESSAGES.investAmountRequiredValidation),
										},
										{
											validator(_, value) {
												return validateMinAmount(value);
											},
										},
										{
											validator(_, value) {
												return validateMaxAmount(value);
											},
										},
										{
											validator() {
												return validateTranchePass();
											},
										},
									]}
									suffix={<AddMaxButtonSuffix form={form} amount={maxInvestmentAmount} />}
								/>
								<Form.Item className="mb-0" label={" "}>
									<Button
										htmlType="submit"
										icon={<Icon name="line-up" size={IconDimension.MIDDLE} />}
										className="w-full h-12 md:w-max capitalize"
									>
										{intl.formatMessage(MESSAGES.investButtonText)}
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

const MESSAGES = defineMessages({
	tranchePassRequired: {
		defaultMessage:
			"You don't have a tranche pass to invest yet. Get in touch: investor@credix.finance",
		description: "Invest in tranche: no tranche pass",
	},
	activeTranchePassRequired: {
		defaultMessage:
			"The tranche pass associated with this account is not active. Get in touch: investor@credix.finance",
		description: "Invest in tranche: tranche pass not active",
	},
	investLoading: {
		defaultMessage: "Investing {amount} USDC",
		description: "Invest in tranche: invest loading",
	},
	investSuccess: {
		defaultMessage: "Successfully invested {amount} USDC",
		description: "Invest in tranche: invest success",
	},
	investFailure: {
		defaultMessage: "Failed to invest in tranche",
		description: "Invest in tranche: invest request failed",
	},
	minInvestmentAmountValidation: {
		defaultMessage: "'amount' needs to be greater than {amount}",
		description: "Invest in tranche: min amount validation message",
	},
	maxInvestmentAmountValidation: {
		defaultMessage: "'amount' needs to be less than or equal to {amount}",
		description: "Invest in tranche: max amount validation message",
	},
	details: {
		defaultMessage: "Details",
		description: "Invest in tranche: details",
	},
	apr: {
		defaultMessage: "APR",
		description: "Invest in tranche: apr",
	},
	size: {
		defaultMessage: "Size",
		description: "Invest in tranche: size",
	},
	yourInvestment: {
		defaultMessage: "Your investment",
		description: "Invest in tranche: your investment",
	},
	value: {
		defaultMessage: "Value",
		description: "Invest in tranche: value",
	},
	projectedValue: {
		defaultMessage: "Projected value",
		description: "Invest in tranche: projected value",
	},
	investAmountInputLabel: {
		defaultMessage: "Invest In Tranche",
		description: "Invest in tranche: amount input label",
	},
	investAmountInputPlaceholder: {
		defaultMessage: "Amount",
		description: "Invest in tranche: amount input placeholder",
	},
	investAmountInputDescription: {
		defaultMessage: "Maximum amount: {amount} USDC",
		description: "Invest in tranche: amount input description",
	},
	investAmountRequiredValidation: {
		defaultMessage: "'amount' is required",
		description: "Invest in tranche: amount required validation message",
	},
	investButtonText: {
		defaultMessage: "invest",
		description: "Invest in tranche: amount form submit button text",
	},
});
