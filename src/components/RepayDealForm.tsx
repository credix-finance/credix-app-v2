import { FunctionComponent } from "react";
import { Form, Input as AntdInput, Select } from "antd";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { Icon } from "@components/Icon";
import { validateMaxValue, validateMinValue } from "@utils/validation.utils";

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
	maxInterestRepayment: number;
	maxPrincipalRepayment: number;
	className?: string;
}

const RepayDealForm: FunctionComponent<RepayDealFormProps> = ({
	onSubmit,
	maxInterestRepayment,
	maxPrincipalRepayment,
	className,
}) => {
	const [form] = Form.useForm();
	const repaymentOptions = [
		{ label: DEAL_REPAYMENT_TYPE.INTEREST, value: DEAL_REPAYMENT_TYPE.INTEREST },
		{ label: DEAL_REPAYMENT_TYPE.PRINCIPAL, value: DEAL_REPAYMENT_TYPE.PRINCIPAL },
	];

	const onAddMax = () => {
		form.getFieldValue("type") === DEAL_REPAYMENT_TYPE.INTEREST
			? form.setFieldsValue({ amount: maxInterestRepayment })
			: form.setFieldsValue({ amount: maxPrincipalRepayment });
	};

	const validateMinAmount = (value): Promise<void> => {
		const validationMessage = "'amount' needs to be greater than 0";
		return validateMinValue(value, 0, validationMessage);
	};

	const validateMaxAmount = (value): Promise<void> => {
		return form.getFieldValue("type") === DEAL_REPAYMENT_TYPE.INTEREST
			? validateMaxInterest(value)
			: validateMaxPrincipal(value);
	};

	const validateMaxInterest = (value): Promise<void> => {
		const validationMessage = "'amount' cannot be greater than the remaining interest";
		return validateMaxValue(value, maxInterestRepayment, validationMessage);
	};

	const validateMaxPrincipal = (value): Promise<void> => {
		const validationMessage = "'amount' cannot be greater than the remaining principal";
		return validateMaxValue(value, maxPrincipalRepayment, validationMessage);
	};

	return (
		<Form
			name="deal"
			initialValues={{ type: DEAL_REPAYMENT_TYPE.INTEREST }}
			form={form}
			onFinish={onSubmit}
			layout="vertical"
			className={className}
		>
			<AntdInput.Group compact>
				<Form.Item
					required={true}
					name="type"
					label="amount"
					className={`font-bold text-base capitalize`}
				>
					<Select
						suffixIcon={<Icon name="arrow-down-square-solid" className="bg-neutral-60 w-6 h-6" />}
					>
						{repaymentOptions.map(({ label, value }) => (
							<Option key={label.toString()} value={value}>
								<span className="uppercase">{label}</span>
							</Option>
						))}
					</Select>
				</Form.Item>
				<Input
					name="amount"
					label="amount"
					className="bg-neutral-0 w-full deal-repay-input"
					labelClassName="label-hidden w-full"
					placeholder="amount"
					type="number"
					suffix={
						<div onClick={onAddMax} className="pr-6 hover:cursor-pointer hover:font-semibold">
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
			</AntdInput.Group>
			<Form.Item className="mb-0">
				<Button htmlType="submit" className="w-full md:w-max capitalize">
					Make Repayment
				</Button>
			</Form.Item>
		</Form>
	);
};

export default RepayDealForm;
