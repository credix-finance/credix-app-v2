import React, { FunctionComponent, ReactNode, useState } from "react";
import { RepaymentScheduleGraph } from "./RepaymentScheduleGraph";
import { RepaymentScheduleTable } from "./RepaymentScheduleTable";
import { Button } from "./Button";
import { ColumnsProps } from "./Table";
import {
	RepaymentScheduleGraphDataPoint,
	RepaymentScheduleTableDataPoint,
} from "@credix_types/repaymentschedule.types";

interface BulletLoanRepaymentScheduleProps {
	children?: ReactNode;
}
export const BulletLoanRepaymentSchedule: FunctionComponent<
	BulletLoanRepaymentScheduleProps
> = () => {
	const [showTable, setShowTable] = useState(false);
	const [graphData] = useState<RepaymentScheduleGraphDataPoint[]>([]);
	const [dataSource] = useState<RepaymentScheduleTableDataPoint[]>();

	const columns: ColumnsProps[] = [
		{
			title: "Date",
			icon: "calendar",
			dataIndex: "date",
			key: "date",
		},
		{
			title: "Principal",
			icon: "coins",
			dataIndex: "principal",
			key: "principal",
		},
		{
			title: "Interest",
			icon: "trend-up-circle",
			dataIndex: "interest",
			key: "interest",
		},
		{
			title: "Balance",
			icon: "trend-up-circle",
			dataIndex: "balance",
			key: "balance",
		},
	];

	return (
		<div>
			<div className="grid grid-cols-2 gap-x-20 mb-8">
				<div className="flex flex-col justify-between">
					<div>
						<Button onClick={() => setShowTable(!showTable)} type="text">
							Show table
						</Button>
					</div>
				</div>
				<div className="text-right">
					<RepaymentScheduleGraph data={graphData} />
				</div>
			</div>
			{showTable && <RepaymentScheduleTable dataSource={dataSource} columns={columns} />}
		</div>
	);
};
