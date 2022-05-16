import React, { FunctionComponent } from "react";
import { ColumnsProps, Table } from "@components/Table";
import { Button } from "@components/Button";
import { RepaymentScheduleTableDataPoint } from "@credix_types/repaymentschedule.types";
import { IconDimension } from "./Icon";
import { currencyFormatter, formatDate } from "@utils/format.utils";
import { useLocales } from "@hooks/useLocales";
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
	columns: ColumnsProps[];
}

export const RepaymentScheduleTable: FunctionComponent<RepaymentScheduleTableProps> = ({
	dataSource,
}) => {
	const intl = useIntl();
	const locales = useLocales();

	const columns: ColumnsProps[] = [
		{
			title: "Date",
			icon: "calendar",
			iconSize: IconDimension.MIDDLE,
			dataIndex: "date",
			key: "date",
			render: (text) => <span>{formatDate(text, locales as string[])}</span>,
		},
		{
			title: "Principal",
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
			title: "Interest",
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
			title: "Balance",
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
			<Table dataSource={dataSource} columns={columns} />
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
