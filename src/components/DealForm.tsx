import { FunctionComponent, useState } from "react";
import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { Form } from "antd";

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
	const [submitDisabled, setSubmitDisabled] = useState(true);

	return (
		<Form
			name="deal"
			form={form}
			onFinish={onSubmit}
			layout="vertical"
			onFieldsChange={(_changedFields, fields) =>
				process.browser && setSubmitDisabled(fields.some((field) => !field.value))
			}
			className="max-w-[624px]"
		>
			<Input
				name="dealName"
				label="Deal Name"
				className="bg-neutral-0"
				placeholder="Name"
				type="text"
			/>
			<Input
				name="borrower"
				label="Borrower Key"
				className="bg-neutral-0"
				placeholder="Key"
				type="text"
			/>
			<Input
				name="principal"
				label="Principal"
				className="bg-neutral-0"
				placeholder="Amount"
				type="number"
			/>
			<Input
				name="financingFee"
				label="Financing Fee"
				className="bg-neutral-0"
				placeholder="%"
				type="number"
			/>
			<Input
				name="timeToMaturity"
				label="Time To Maturity"
				className="bg-neutral-0"
				placeholder="days"
				type="number"
			/>
			<Form.Item className="mb-0">
				<Button disabled={submitDisabled} htmlType="submit" className="w-full md:w-max capitalize">
					Create Deal
				</Button>
			</Form.Item>
		</Form>
	);
};

export default DealForm;
