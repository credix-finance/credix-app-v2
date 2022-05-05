import React, { FunctionComponent } from "react";
import { TableProps as AntdTableProps } from "antd/lib/table";
import { ColumnsProps, Table } from "./Table";
import { Button } from "./Button";

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
	dataSource: AntdTableProps<any>["dataSource"];
	columns: ColumnsProps[];
}

export const RepaymentScheduleTable: FunctionComponent<RepaymentScheduleTableProps> = ({
	dataSource,
	columns,
}) => {
	return (
		<>
			<Table dataSource={dataSource} columns={columns} />
			<div className="flex justify-end">
				<Button type="text">Export table</Button>
			</div>
		</>
	);
};
