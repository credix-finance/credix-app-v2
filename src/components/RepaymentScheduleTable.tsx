import React, { FunctionComponent } from "react";
import { ColumnsProps, Table } from "@components/Table";
import { Button } from "@components/Button";
import { RepaymentScheduleTableDataPoint } from "@credix_types/repaymentschedule.types";
import { IconDimension } from "./Icon";
import { currencyFormatter } from "@utils/format.utils";
import { defineMessages, useIntl } from "react-intl";

export enum RepaymentScheduleAmountType {
	INTEREST = "interest",
	PRINCIPAL = "principal",
}

export interface RepaymentScheduleDataPoint {
	month: string;
	type: RepaymentScheduleAmountType;
	amount: number;
}

interface RepaymentScheduleTableProps {
	dataSource: RepaymentScheduleTableDataPoint[];
	showRepaid?: boolean;
}

export const RepaymentScheduleTable: FunctionComponent<RepaymentScheduleTableProps> = ({
	dataSource,
	showRepaid = false,
}) => {
	const intl = useIntl();

	const columns: ColumnsProps[] = [
		{
			title: intl.formatMessage(MESSAGES.day),
			icon: "calendar",
			iconSize: IconDimension.MIDDLE,
			dataIndex: "day",
			key: "day",
		},
		{
			title: intl.formatMessage(MESSAGES.principal),
			icon: "coins",
			iconSize: IconDimension.MIDDLE,
			dataIndex: "principal",
			key: "principal",
			titleClassName: "justify-end",
			align: "right",
			render: (text) => (
				<span className="font-medium text-lg">{currencyFormatter.format(text)} USDC</span>
			),
		},
		{
			title: intl.formatMessage(MESSAGES.interest),
			icon: "trend-up",
			iconSize: IconDimension.MIDDLE,
			dataIndex: "interest",
			key: "interest",
			titleClassName: "justify-end",
			align: "right",
			render: (text) => (
				<span className="font-medium text-lg">{currencyFormatter.format(text)} USDC</span>
			),
		},
		{},
		{
			title: intl.formatMessage(MESSAGES.balance),
			icon: "line-chart",
			iconSize: IconDimension.MIDDLE,
			dataIndex: "balance",
			key: "balance",
			titleClassName: "justify-end",
			align: "right",
			render: (text) => (
				<span className="font-medium text-lg">{currencyFormatter.format(text)} USDC</span>
			),
		},
	];

	if (showRepaid) {
		// Insert repaid column between interest and balance columns
		columns.splice(3, 0, {
			title: intl.formatMessage(MESSAGES.repaid),
			icon: "trend-up",
			iconSize: IconDimension.MIDDLE,
			dataIndex: "repaid",
			key: "repaid",
			titleClassName: "justify-end",
			align: "right",
			render: (text) => (
				<span className="font-medium text-lg">{currencyFormatter.format(text)} USDC</span>
			),
		});
	}

	return (
		<>
			<Table dataSource={dataSource} columns={columns} rowkey="date" />
			<div className="flex justify-end">
				<Button type="text">{intl.formatMessage(MESSAGES.export)}</Button>
			</div>
		</>
	);
};

const MESSAGES = defineMessages({
	export: {
		defaultMessage: "Export table",
		description: "Deal form: repayment schedule table export button",
	},
	balance: {
		defaultMessage: "Balance",
		description: "Repayment schedule table column: balance",
	},
	repaid: {
		defaultMessage: "Repaid",
		description: "Repayment schedule table column: repaid",
	},
	interest: {
		defaultMessage: "Interest",
		description: "Repayment schedule table column: interest",
	},
	principal: {
		defaultMessage: "Principal",
		description: "Repayment schedule table column: principal",
	},
	day: {
		defaultMessage: "Day",
		description: "Repayment schedule table column: day",
	},
});
