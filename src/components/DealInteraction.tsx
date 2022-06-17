import React, { FunctionComponent, ReactNode } from "react";
import { useIntl } from "react-intl";
import { Form, FormInstance } from "antd";
import { AddMaxButtonSuffix } from "./AddMaxButtonSuffix";
import { Input } from "./Input";
import { Button } from "./Button";
import { Icon, IconDimension, IconName } from "./Icon";

export const DealInteraction: FunctionComponent<DealInteractionProps> = ({
	title,
	icon,
	content,
	onSubmit,
	maxAmount,
}) => {
	const intl = useIntl();
	const [form] = Form.useForm();

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
						label={intl.formatMessage({
							defaultMessage: "Amount",
							description: "Interact with deal: amount input label",
						})}
						className="bg-credix-primary"
						labelClassName="font-bold text-sm"
						placeholder={intl.formatMessage({
							defaultMessage: "USDC",
							description: "Interact with deal: amount input placeholder",
						})}
						name="amount"
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
}
