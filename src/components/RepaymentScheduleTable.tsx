import React, { FunctionComponent } from "react";
import { ColumnsProps, Table, TableProps } from "@components/Table";
import { Button } from "@components/Button";

interface RepaymentScheduleTableProps {
	dataSource: TableProps["dataSource"];
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
