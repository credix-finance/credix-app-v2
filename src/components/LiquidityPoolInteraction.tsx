import React, { useCallback, useEffect, useState } from "react";
import { Form } from "antd";
import { FormProps } from "antd/lib/form";
import { Icon } from "@components/Icon";
import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { InvestmentDetails } from "@components/InvestmentDetails";
import { useCredixClient } from "@credix/credix-client";
import { defaultMarketplace } from "../consts";
import { useWallet } from "@solana/wallet-adapter-react";
import { TokenAmount } from "@solana/web3.js";
import Big from "big.js";
import { validateMaxValue, validateMinValue } from "utils/validation.utils";
import { useStore } from "state/useStore";

export interface LiquidityPoolInteractionForm {
	amount: number;
}

interface LiquidityPoolInteractionProps {
	/**
	 * The action that will be performed on the liquidity pool.
	 * "invest" will transfer USDC from the user's wallet to the liquidity pool in exchange for LP tokens
	 * "withdraw" will transfer USDC from the liquidity pool in exchange for LP tokens
	 */
	action: "invest" | "withdraw";
	/**
	 * Action to perform when form is submitted
	 */
	onSubmit: FormProps["onFinish"];
	/**
	 * Action to perform when form submission fails
	 */
	onSubmitFailed?: FormProps["onFinishFailed"];
}

export const LiquidityPoolInteraction = ({
	action,
	onSubmit,
	onSubmitFailed,
}: LiquidityPoolInteractionProps) => {
	const client = useCredixClient();
	const fetchMarket = useStore((state) => state.fetchMarket);
	const market = useStore((state) => state.market);
	const { publicKey } = useWallet();
	const [userBaseBalance, setUserBaseBalance] = useState<TokenAmount>();
	const [userStake, setUserStake] = useState<Big>(new Big(0));
	const [form] = Form.useForm();
	const [maxInvestmentAmount, setMaxInvestmentAmount] = useState<number>(0);
	const [maxWithdrawalAmount, setMaxWithdrawalAmount] = useState<number>(0);

	useEffect(() => {
		fetchMarket(client, defaultMarketplace);
	}, [client, fetchMarket]);

	const getUserBaseBalance = useCallback(async () => {
		if (!publicKey) {
			return;
		}

		const userBaseBalance = await market?.userBaseBalance(publicKey);
		setUserBaseBalance(userBaseBalance);

		if (userBaseBalance) {
			setMaxInvestmentAmount(userBaseBalance.uiAmount);
		}
	}, [market, publicKey]);

	const getUserStake = useCallback(async () => {
		if (!publicKey) {
			return;
		}

		try {
			const userStake = await market?.getUserStake(publicKey);
			setUserStake(userStake);
			setMaxWithdrawalAmount(userStake.toNumber());
		} catch (error) {
			setUserStake(new Big(0));
		}
	}, [market, publicKey]);

	useEffect(() => {
		getUserBaseBalance();
	}, [getUserBaseBalance]);

	useEffect(() => {
		getUserStake();
	}, [getUserStake]);

	const onAddMax = () => {
		form.setFieldsValue({
			amount: getMaxValue,
		});
	};

	const getMaxValue = action === "invest" ? maxInvestmentAmount : maxWithdrawalAmount;

	const validateMaxAmount = (value): Promise<void> => {
		const maxValue = getMaxValue;
		const validationMessage = `'amount' needs to be less than or equal to ${
			action === "invest" ? "your balance" : "your invested amount"
		}`;

		return validateMaxValue(value, maxValue, validationMessage);
	};

	const validateMinAmount = (value): Promise<void> => {
		const validationMessage = "'amount' needs to be greater than 0";
		return validateMinValue(value, 0, validationMessage);
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const onFinish = async (values: any) => {
		await onSubmit(values);
		form.resetFields();
	};

	return (
		<div className="p-6 md:p-12 bg-neutral-0 space-y-7">
			<h2 className="space-x-5 flex items-center">
				<Icon name="line-chart" className="w-7 h-7" />
				<span className="uppercase font-bold text-2xl">{action}</span>
			</h2>
			<InvestmentDetails
				balance={userBaseBalance}
				balanceCurrency="USDC"
				investments={userStake}
				investmentsCurrency="USDC"
			/>
			<Form
				name="invest"
				form={form}
				onFinish={onFinish}
				onFinishFailed={onSubmitFailed}
				layout="vertical"
				className="max-w-[624px]"
			>
				<Input
					name="amount"
					label="AMOUNT"
					className="bg-neutral-0"
					placeholder="e.g. 0.0007"
					type="number"
					addonBefore="USDC"
					required={true}
					rules={[
						{ required: true },
						{
							validator(_, value) {
								return validateMaxAmount(value);
							},
						},
						{
							validator(_, value) {
								return validateMinAmount(value);
							},
						},
					]}
					suffix={
						<div
							onClick={onAddMax}
							className="md:pr-20 hover:cursor-pointer font-medium hover:font-semibold"
						>
							MAX
						</div>
					}
				/>
				<Form.Item className="mb-0">
					<Button htmlType="submit" className="w-full md:w-max capitalize">
						{action}
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
};
