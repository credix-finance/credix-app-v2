import React, { ReactNode } from "react";
import { Form } from "antd";
import { FormProps } from "antd/lib/form";
import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { validateMaxValue, validateMinValue } from "@utils/validation.utils";
import { AddMaxButtonSuffix } from "@components/AddMaxButtonSuffix";
import { defineMessages } from "@formatjs/intl";
import { useIntl } from "react-intl";

export enum LPInteraction {
	INVEST = "invest",
	WITHDRAW = "withdraw",
}
export interface LiquidityPoolInteractionForm {
	amount: number;
}

interface LiquidityPoolInteractionProps {
	/**
	 * The action that will be performed on the liquidity pool.
	 * "invest" will transfer USDC from the user's wallet to the liquidity pool in exchange for LP tokens
	 * "withdraw" will transfer USDC from the liquidity pool in exchange for LP tokens
	 */
	action: LPInteraction;
	/**
	 * Action to perform when form is submitted
	 */
	onSubmit: FormProps["onFinish"];
	/**
	 * Action to perform when form submission fails
	 */
	onSubmitFailed?: FormProps["onFinishFailed"];
	maxValue: number;
	icon: ReactNode;
}

export const LiquidityPoolInteraction = ({
	action,
	onSubmit,
	onSubmitFailed,
	maxValue,
	icon,
}: LiquidityPoolInteractionProps) => {
	const [form] = Form.useForm();
	const intl = useIntl();

	const validateMaxAmount = (value): Promise<void> => {
		const validationMessage = intl.formatMessage(
			action === LPInteraction.INVEST
				? MESSAGES.maxBalanceValidationMessage
				: MESSAGES.maxInvestedAmountValidationMessage
		);

		return validateMaxValue(value, maxValue, validationMessage);
	};

	const validateMinAmount = (value): Promise<void> => {
		const validationMessage = intl.formatMessage(MESSAGES.minAmountValidationMessage);
		return validateMinValue(value, 0, validationMessage);
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const onFinish = async (values: any) => {
		await onSubmit(values);
		form.resetFields();
	};

	return (
		<Form
			name="invest"
			form={form}
			onFinish={onFinish}
			onFinishFailed={onSubmitFailed}
			layout="vertical"
		>
			<Input
				name="amount"
				label={intl.formatMessage(MESSAGES.amountInputLabel)}
				step="0.1"
				className="bg-credix-primary"
				placeholder={intl.formatMessage(MESSAGES.amountInputPlaceholder)}
				labelClassName="mb-4"
				lang="en"
				type="number"
				required={true}
				rules={[
					{ required: true, message: intl.formatMessage(MESSAGES.amountRequiredValidationMessage) },
					{
						validator: (_, value) => validateMaxAmount(value),
					},
					{
						validator: (_, value) => validateMinAmount(value),
					},
				]}
				suffix={<AddMaxButtonSuffix form={form} amount={maxValue} />}
			/>
			<Form.Item className="mb-0">
				<Button htmlType="submit" className="w-full md:w-max capitalize" icon={icon}>
					{action}
				</Button>
			</Form.Item>
		</Form>
	);
};

const MESSAGES = defineMessages({
	amountRequiredValidationMessage: {
		defaultMessage: "'amount' is required",
		description: "Liquiditypoolinteraction amount required validation message",
	},
	maxBalanceValidationMessage: {
		defaultMessage: "'amount' needs to be less than or equal to your balance",
		description: "Liquiditypoolinteraction max balance validation message",
	},
	maxInvestedAmountValidationMessage: {
		defaultMessage: "'amount' needs to be less than or equal to your invested amount",
		description: "Liquiditypoolinteraction max invested amount validation message",
	},
	minAmountValidationMessage: {
		defaultMessage: "'amount' needs to be greater than 0",
		description: "Liquiditypoolinteraction min amount validation message",
	},
	amountInputLabel: {
		defaultMessage: "Amount",
		description: "Liquiditypoolinteraction amount input label",
	},
	amountInputPlaceholder: {
		defaultMessage: "USDC",
		description: "Liquiditypoolinteraction amount input placeholder",
	},
});
