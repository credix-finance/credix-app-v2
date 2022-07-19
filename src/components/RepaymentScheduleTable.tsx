import React, { FunctionComponent } from "react";
import { ColumnsProps, Table } from "@components/Table";
import { Button } from "@components/Button";
import { RepaymentScheduleTableDataPoint } from "@credix_types/repaymentschedule.types";
import { IconDimension } from "./Icon";
import { currencyFormatter } from "@utils/format.utils";
import { useIntl } from "react-intl";

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
}

export const RepaymentScheduleTable: FunctionComponent<RepaymentScheduleTableProps> = ({
	dataSource,
}) => {
	const intl = useIntl();

	const columns: ColumnsProps[] = [
		{
			title: intl.formatMessage({
				defaultMessage: "Day",
				description: "Repayment schedule table column: day",
			}),
			icon: "calendar",
			iconSize: IconDimension.MIDDLE,
			dataIndex: "day",
			key: "day",
		},
		{
			title: intl.formatMessage({
				defaultMessage: "Principal",
				description: "Repayment schedule table column: principal",
			}),
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
			title: intl.formatMessage({
				defaultMessage: "Interest",
				description: "Repayment schedule table column: interest",
			}),
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
		{
			title: intl.formatMessage({
				defaultMessage: "Balance",
				description: "Repayment schedule table column: balance",
			}),
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

	return (
		<>
			<Table dataSource={dataSource} columns={columns} rowKey="day" />
			<div className="flex justify-end">
				<Button type="text">
					{intl.formatMessage({
						defaultMessage: "Export table",
						description: "Deal form: repayment schedule table export button",
					})}
				</Button>
			</div>
		</>
	);
};
