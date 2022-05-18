import React, { FunctionComponent, useEffect } from "react";
import { Form, Input as AntdInput, Select } from "antd";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { Icon } from "@components/Icon";
import { validateMaxValue, validateMinValue } from "@utils/validation.utils";
import { useIntl } from "react-intl";
import { Deal } from "@credix/credix-client";

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
	monthlyRepaymentAmount: number;
	className?: string;
	deal: Deal;
}

const RepayDealForm: FunctionComponent<RepayDealFormProps> = ({
	onSubmit,
	maxInterestRepayment,
	maxPrincipalRepayment,
	monthlyRepaymentAmount,
	className,
	deal,
}) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const repaymentOptions = [
		{
			label: intl.formatMessage({
				defaultMessage: "interest",
				description: "RepayDealForm: interest repayment type",
			}),
			value: DEAL_REPAYMENT_TYPE.INTEREST,
		},
		{
			label: intl.formatMessage({
				defaultMessage: "principal",
				description: "RepayDealForm: principal repayment type",
			}),
			value: DEAL_REPAYMENT_TYPE.PRINCIPAL,
		},
	];

	const onAddMax = () => {
		form.getFieldValue("type") === DEAL_REPAYMENT_TYPE.INTEREST
			? form.setFieldsValue({ amount: maxInterestRepayment })
			: form.setFieldsValue({ amount: maxPrincipalRepayment });
	};

	const validateMinAmount = (value): Promise<void> => {
		const validationMessage = intl.formatMessage({
			defaultMessage: "'amount' needs to be greater than 0",
			description: "RepayDealForm: min amount validation",
		});
		return validateMinValue(value, 0, validationMessage);
	};

	const validateMaxAmount = (value): Promise<void> => {
		return form.getFieldValue("type") === DEAL_REPAYMENT_TYPE.INTEREST
			? validateMaxInterest(value)
			: validateMaxPrincipal(value);
	};

	const validateMaxInterest = (value): Promise<void> => {
		const validationMessage = intl.formatMessage({
			defaultMessage: "'amount' cannot be greater than the remaining interest",
			description: "RepayDealForm: max interest validation",
		});
		return validateMaxValue(value, maxInterestRepayment, validationMessage);
	};

	const validateMaxPrincipal = (value): Promise<void> => {
		const validationMessage = intl.formatMessage({
			defaultMessage: "'amount' cannot be greater than the remaining principal",
			description: "RepayDealForm: max principal validation",
		});
		return validateMaxValue(value, maxPrincipalRepayment, validationMessage);
	};

	const validateInterestRepaid = (value): Promise<void> => {
		if (value === DEAL_REPAYMENT_TYPE.PRINCIPAL && !deal.interestToRepay.eq(0)) {
			return Promise.reject(
				intl.formatMessage({
					defaultMessage: "Interest needs to be repaid in full before the principal can be repaid.",
					description: "Repay deal: principal repayment validation failed",
				})
			);
		}
		return Promise.resolve();
	};

	useEffect(() => {
		// We can't use initial values here because initially monthlyRepaymentAmount is undefined
		form.setFieldsValue({ amount: monthlyRepaymentAmount });
	}, [form, monthlyRepaymentAmount]);

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
					label={intl.formatMessage({
						defaultMessage: "amount",
						description: "RepayDealForm: amount input label",
					})}
					className="font-bold text-base capitalize interest-select"
					rules={[
						{ required: true },
						{
							validator(_, value) {
								return validateInterestRepaid(value);
							},
						},
					]}
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
					placeholder={intl.formatMessage({
						defaultMessage: "amount",
						description: "RepayDealForm: amount input placeholder",
					})}
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
