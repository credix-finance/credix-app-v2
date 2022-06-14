import React, { FunctionComponent, useEffect } from "react";
import { Form } from "antd";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { validateMaxValue, validateMinValue } from "@utils/validation.utils";
import { useIntl } from "react-intl";

export interface RepayDealFormInput {
	amount: number;
}

interface RepayDealFormProps {
	onSubmit: ({ amount }: RepayDealFormInput) => void;
	monthlyRepaymentAmount: number;
	className?: string;
}

const RepayDealForm: FunctionComponent<RepayDealFormProps> = ({
	onSubmit,
	monthlyRepaymentAmount,
	className,
}) => {
	const intl = useIntl();
	const [form] = Form.useForm();

	const onAddMax = () => {
		form.getFieldValue("type") === monthlyRepaymentAmount.toString();
	};

	const validateMinAmount = (value): Promise<void> => {
		const validationMessage = intl.formatMessage({
			defaultMessage: "'amount' needs to be greater than 0",
			description: "RepayDealForm: min amount validation",
		});
		return validateMinValue(value, 0, validationMessage);
	};

	const validateMaxAmount = (value): Promise<void> => {
		const validationMessage = intl.formatMessage(
			{
				defaultMessage:
					"'amount' cannot be greater than the monthly repayment amount of {amount} USDC",
				description: "RepayDealForm: max repayment validation",
			},
			{ amount: monthlyRepaymentAmount.toString() }
		);
		return validateMaxValue(value, monthlyRepaymentAmount, validationMessage);
	};

	useEffect(() => {
		// We can't use initial values here because initially monthlyRepaymentAmount is undefined
		form.setFieldsValue({ amount: monthlyRepaymentAmount });
	}, [form, monthlyRepaymentAmount]);

	return (
		<Form name="deal" form={form} onFinish={onSubmit} layout="vertical" className={className}>
			<Input
				name="amount"
				label="amount"
				className="bg-neutral-0 w-full"
				placeholder={intl.formatMessage({
					defaultMessage: "amount",
					description: "RepayDealForm: amount input placeholder",
				})}
				type="number"
				suffix={
					<div onClick={onAddMax} className="pr-4 hover:cursor-pointer hover:font-semibold">
						MAX
					</div>
				}
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
			/>
			<Form.Item className="mb-0">
				<Button htmlType="submit" className="w-full md:w-max capitalize">
					Make Repayment
				</Button>
			</Form.Item>
		</Form>
	);
};

export default RepayDealForm;
