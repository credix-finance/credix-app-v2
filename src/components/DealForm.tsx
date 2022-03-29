import { FunctionComponent } from "react";
import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { Form } from "antd";
import { validateMinValue } from "@utils/validation.utils";

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

	return (
		<Form name="deal" form={form} onFinish={onSubmit} layout="vertical" className="max-w-[624px]">
			<Input
				name="dealName"
				label="Deal Name"
				className="bg-neutral-0"
				placeholder="Name"
				type="text"
				required={true}
				rules={[{ required: true, message: "'deal name' is required" }]}
			/>
			<Input
				name="borrower"
				label="Borrower Key"
				className="bg-neutral-0"
				placeholder="Key"
				type="text"
				required={true}
				rules={[{ required: true, message: "'borrower key' is required" }]}
			/>
			<Input
				name="principal"
				label="Principal"
				className="bg-neutral-0"
				placeholder="Amount"
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
				className="bg-neutral-0"
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
				className="bg-neutral-0"
				placeholder="days"
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
