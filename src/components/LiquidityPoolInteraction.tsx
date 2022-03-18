import React, { useState } from "react";
import { Icon } from "@components/Icon";
import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { InvestmentDetails } from "@components/InvestmentDetails";
import { Form } from "antd";
import { FormProps } from "antd/lib/form";

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
	onSubmitFailed: FormProps["onFinishFailed"];
}

export const LiquidityPoolInteraction = ({
	action,
	onSubmit,
	onSubmitFailed,
}: LiquidityPoolInteractionProps) => {
	// TODO: get these values from client
	const balance = 65;
	const investments = 256;
	const investmentsReturn = 3.24;

	const [form] = Form.useForm();
	const [submitDisabled, setSubmitDisabled] = useState(true);
	const onAddMax = () => {
		form.setFieldsValue({ amount: action === "invest" ? balance : investments });
		setSubmitDisabled(false);
	};

	return (
		<div className="p-6 md:p-12 bg-neutral-0 space-y-7">
			<h2 className="space-x-5 flex items-center">
				<Icon name="line-chart" className="w-7 h-7" />
				<span className="uppercase font-bold text-2xl">{action}</span>
			</h2>
			<InvestmentDetails
				balance={balance}
				balanceCurrency="USDC"
				investments={investments}
				investmentsCurrency="USDC"
				investmentsReturn={investmentsReturn}
			/>
			<Form
				name="invest"
				form={form}
				onFinish={onSubmit}
				onFinishFailed={onSubmitFailed}
				layout="vertical"
				onFieldsChange={(_changedFields, fields) =>
					process.browser && setSubmitDisabled(fields.some((field) => !field.value))
				}
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
					suffix={
						<div
							onClick={onAddMax}
							className="pl-[14.5px] md:pr-14 hover:cursor-pointer hover:font-semibold"
						>
							MAX
						</div>
					}
				/>
				<Form.Item className="mb-0">
					<Button
						disabled={submitDisabled}
						htmlType="submit"
						className="w-full md:w-max capitalize"
					>
						{action}
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
};
