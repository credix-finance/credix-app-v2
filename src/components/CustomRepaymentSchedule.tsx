import { generateGraphAndTableData } from "@utils/repayment.utils";
import { Form } from "antd";
import { FunctionComponent } from "react";
import { defineMessages, useIntl } from "react-intl";
import { DealFormField } from "./DealForm";
import { RepaymentSchedule } from "./RepaymentSchedule";
import { SelectorCard } from "./SelectorCard";

interface CustomRepaymentScheduleProps {
	className?: string;
	isInteractive?: boolean;
	subtitle?: string;
	checked?: boolean;
	action?: React.ReactNode;
	showContent?: boolean;
}
export const CustomRepaymentSchedule: FunctionComponent<CustomRepaymentScheduleProps> = ({
	isInteractive,
	subtitle,
	checked,
	action,
	showContent,
}) => {
	const intl = useIntl();
	const form = Form.useFormInstance();
	const schedule = Form.useWatch(DealFormField.Schedule, form);

	if (!schedule) {
		return null;
	}

	const { graphData, dataSource } = generateGraphAndTableData(schedule);

	return (
		<SelectorCard
			isInteractive={isInteractive}
			content={<RepaymentSchedule dataSource={dataSource} graphData={graphData} />}
			value={DealFormField.CustomRepaymentSchedule}
			title={intl.formatMessage(MESSAGES.title)}
			subtitle={subtitle}
			checked={checked}
			action={action}
			showContent={showContent}
		/>
	);
};

const MESSAGES = defineMessages({
	title: {
		defaultMessage: "Custom schedule",
		description: "Custom repayment schedule: title",
	},
});
