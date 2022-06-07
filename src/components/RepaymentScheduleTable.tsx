import React, { FunctionComponent } from "react";
import { ColumnsProps, Table } from "@components/Table";
import { Button } from "@components/Button";
import { RepaymentScheduleTableDataPoint } from "@credix_types/repaymentschedule.types";

interface RepaymentScheduleTableProps {
	dataSource: RepaymentScheduleTableDataPoint[];
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
