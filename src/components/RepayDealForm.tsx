import { FunctionComponent, useEffect, useState } from "react";
import { Form, Select, Input as AntdInput } from "antd";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { Icon } from "@components/Icon";

const { Option } = Select;

export enum DEAL_REPAYMENT_TYPE {
	INTEREST = "interest",
	PRINCIPAL = "principal",
}
export interface RepayDealFormInput {
	type: DEAL_REPAYMENT_TYPE;
	amount: number;
}

interface RepayDealFormProps {
	onSubmit: ({ type, amount }: RepayDealFormInput) => void;
}

const RepayDealForm: FunctionComponent<RepayDealFormProps> = ({ onSubmit }) => {
	const [form] = Form.useForm();
	const [submitDisabled, setSubmitDisabled] = useState(null);

	const onAddMax = () => {
		form.setFieldsValue({ amount: 100000 });
		setSubmitDisabled(false);
	};

	useEffect(() => setSubmitDisabled(true), []);

	return (
		<Form
			name="deal"
			form={form}
			onFinish={onSubmit}
			layout="vertical"
			onFieldsChange={(_changedFields, fields) =>
				setSubmitDisabled(fields.some((field) => !field.value))
			}
			className="max-w-[624px]"
		>
			<AntdInput.Group compact>
				<Form.Item
					label="AMOUNT"
					className={`
				font-bold text-base
			`}
				>
					<Select
						defaultValue="interest"
						suffixIcon={() => (
							<Icon name="arrow-down-square-solid" className="bg-neutral-60 w-6 h-6" />
						)}
					>
						<Option value="interest">
							<span className="uppercase">interest</span>
						</Option>
						<Option value="principal">
							<span className="uppercase">principal</span>
						</Option>
					</Select>
				</Form.Item>
				<Input
					name="amount"
					label=" "
					className="bg-neutral-0 w-full"
					placeholder="Amount"
					type="number"
					suffix={
						<div
							onClick={onAddMax}
							className="pl-[14.5px] hover:cursor-pointer hover:font-semibold"
						>
							MAX
						</div>
					}
				/>
			</AntdInput.Group>
			<Form.Item className="mb-0">
				<Button disabled={submitDisabled} htmlType="submit" className="w-full md:w-max capitalize">
					Make Repayment
				</Button>
			</Form.Item>
		</Form>
	);
};

export default RepayDealForm;
