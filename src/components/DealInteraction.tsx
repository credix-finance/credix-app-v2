import React, { FunctionComponent, ReactNode } from "react";
import { defineMessages, useIntl } from "react-intl";
import { Form, FormInstance } from "antd";
import { AddMaxButtonSuffix } from "./AddMaxButtonSuffix";
import { Input } from "./Input";
import { Button } from "./Button";
import { Icon, IconDimension, IconName } from "./Icon";
import { validateMinValue } from "@utils/validation.utils";
import { Rule } from "antd/lib/form";

const MESSAGES = defineMessages({
	minAmountValidation: {
		defaultMessage: "'amount' needs to be greater than {amount}",
		description: "Deal intereaction: min amount validation message",
	},
	amountInputLabel: {
		defaultMessage: "Amount",
		description: "Interact with deal: amount input label",
	},
	amountInputPlaceholder: {
		defaultMessage: "USDC",
		description: "Interact with deal: amount input placeholder",
	},
	requiredValidation: {
		defaultMessage: "'amount' is required",
		description: "Deal interaction: amount required validation message",
	},
});

export const DealInteraction: FunctionComponent<DealInteractionProps> = ({
	title,
	icon,
	content,
	onSubmit,
	maxAmount,
	validationRules = [],
}) => {
	const intl = useIntl();
	const [form] = Form.useForm();

	const validateMinAmount = (value): Promise<void> => {
		const minAmount = 0;
		const validationMessage = intl.formatMessage(MESSAGES.minAmountValidation, {
			amount: minAmount,
		});
		return validateMinValue(value, minAmount, validationMessage);
	};

	return (
		<div>
			<div className="flex space-x-4 items-center">
				<Icon name={icon} size={IconDimension.MIDDLE} />
				<div className="uppercase font-bold text-2xl">{title}</div>
			</div>
			<div className="border border-dashed border-black mt-6 py-6 px-8 rounded-[4px]">
				{content}
				<Form
					name="repay"
					form={form}
					onFinish={(values) => onSubmit(values, form)}
					layout="vertical"
					className="mt-6"
				>
					<Input
						type="number"
						lang="en"
						step="1"
						label={intl.formatMessage(MESSAGES.amountInputLabel)}
						className="bg-credix-primary"
						labelClassName="font-bold text-sm"
						placeholder={intl.formatMessage(MESSAGES.amountInputPlaceholder)}
						name="amount"
						required={true}
						rules={[
							{
								required: true,
								message: intl.formatMessage(MESSAGES.requiredValidation),
							},
							{
								validator(_, value) {
									return validateMinAmount(value);
								},
							},
							...validationRules,
						]}
						suffix={<AddMaxButtonSuffix form={form} amount={maxAmount} />}
					/>
					<Form.Item className="mb-0">
						<Button htmlType="submit" className="w-full md:w-max capitalize">
							<div className="flex space-x-2 items-center">
								<Icon name={icon} size={IconDimension.SMALL} />
								<div>{title}</div>
							</div>
						</Button>
					</Form.Item>
				</Form>
			</div>
		</div>
	);
};

interface DealInteractionProps {
	title: string;
	icon: IconName;
	maxAmount: number;
	onSubmit: ({ amount }, form: FormInstance) => void;
	content: ReactNode;
	validationRules?: Rule[];
}
