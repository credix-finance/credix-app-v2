import React, { FunctionComponent, ReactNode, useState } from "react";
import { Input } from "@components/Input";
import { RepaymentScheduleGraph } from "@components/RepaymentScheduleGraph";
import { RepaymentScheduleTable } from "@components/RepaymentScheduleTable";
import { Button } from "@components/Button";
import { ColumnsProps, TableProps } from "@components/Table";
import { RepaymentScheduleDataPoint } from "@credix_types/repaymentschedule.types";

interface AmortizationRepaymentScheduleProps {
	children?: ReactNode;
}

export const AmortizationRepaymentSchedule: FunctionComponent<
	AmortizationRepaymentScheduleProps
> = () => {
	const [showTable, setShowTable] = useState(false);
	const [graphData] = useState<RepaymentScheduleDataPoint[]>([]);
	const [dataSource] = useState<TableProps["dataSource"]>();

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
					<Input
						label="Grace period"
						description="Grace period is a time period granted on which the borrower does not have to pay anything toward the loan"
						placeholder="0 days"
						disabled={true}
					/>
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
