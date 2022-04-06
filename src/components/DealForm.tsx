import React, { FunctionComponent } from "react";
import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { Form } from "antd";
import { validateMinValue, validatePublicKey } from "@utils/validation.utils";

export interface DealFormInput {
	principal: number;
	financingFee: number;
	timeToMaturity: number;
	borrower: string;
	dealName: string;
}

interface DealFormProps {
	onSubmit: ({
		principal,
		financingFee,
		timeToMaturity,
		borrower,
		dealName,
	}: DealFormInput) => void;
}

const DealForm: FunctionComponent<DealFormProps> = ({ onSubmit }) => {
	const [form] = Form.useForm();

	const validateMinPrincipal = (value): Promise<void> => {
		const validationMessage = "'principal' needs to be greater than 0";
		return validateMinValue(value, 0, validationMessage);
	};

	const validateMinTimeToMaturity = (value): Promise<void> => {
		const validationMessage = "'time to maturity' needs to be greater than 0";
		return validateMinValue(value, 0, validationMessage);
	};

	const validateBorrowerKey = (value): Promise<void> => {
		const validationMessage = "'borrower key' isn't valid";
		return validatePublicKey(value, validationMessage);
	};

	return (
		<Form name="deal" form={form} onFinish={onSubmit} layout="vertical">
			<Input
				name="dealName"
				label="Deal Name"
				placeholder="Name"
				type="text"
				required={true}
				rules={[{ required: true, message: "'deal name' is required" }]}
			/>
			<Input
				name="borrower"
				label="Borrower Key"
				placeholder="Public key"
				type="text"
				required={true}
				rules={[
					{ required: true, message: "'borrower key' is required" },
					{
						validator(_, value) {
							return validateBorrowerKey(value);
						},
					},
				]}
			/>
			<Input
				name="principal"
				label="Principal"
				placeholder="USDC amount"
				type="number"
				lang="en"
				step="1"
				required={true}
				rules={[
					{ required: true },
					{
						validator(_, value) {
							return validateMinPrincipal(value);
						},
					},
				]}
			/>
			<Input
				name="financingFee"
				label="Financing Fee"
				placeholder="%"
				type="number"
				lang="en"
				step="0.1"
				required={true}
				rules={[{ required: true, message: "'financing fee' is required" }]}
			/>
			<Input
				name="timeToMaturity"
				label="Time To Maturity"
				placeholder="Number of days"
				type="number"
				required={true}
				step="1"
				lang="en"
				rules={[
					{ required: true, message: "'time to maturity' is required" },
					{
						validator(_, value) {
							return validateMinTimeToMaturity(value);
						},
					},
				]}
			/>
			<Form.Item className="mb-0">
				<Button htmlType="submit" className="w-full md:w-max capitalize">
					Create Deal
				</Button>
			</Form.Item>
		</Form>
	);
};

export default DealForm;
