import React, { FunctionComponent, ReactNode, useState } from "react";
import { Input } from "@components/Input";
import { RepaymentScheduleGraph } from "./RepaymentScheduleGraph";
import { RepaymentScheduleTable } from "./RepaymentScheduleTable";
import { Button } from "./Button";
import { ColumnsProps } from "./Table";
import {
	RepaymentScheduleAmountType,
	RepaymentScheduleDataPoint,
} from "@credix_types/repaymentschedule.types";

interface AmortizationRepaymentScheduleProps {
	children?: ReactNode;
}

export const AmortizationRepaymentSchedule: FunctionComponent<
	AmortizationRepaymentScheduleProps
> = () => {
	const [showTable, setShowTable] = useState(false);

	const data: RepaymentScheduleDataPoint[] = [];
	for (let i = 1; i <= 12; i++) {
		data.push({
			month: i.toString(),
			type: RepaymentScheduleAmountType.INTEREST,
			amount: 120 - i * 10,
		});

		data.push({
			month: i.toString(),
			type: RepaymentScheduleAmountType.PRINCIPAL,
			amount: i * 10,
		});
	}

	const dataSource = [
		{
			date: "23 January",
			principal: "200 000",
			interest: "20 000",
			balance: "1 780 000",
		},
		{
			date: "23 Febrary",
			principal: "443 000",
			interest: "19 250",
			balance: "1 570 000",
		},
		{
			date: "23 March",
			principal: "669 250",
			interest: "18 150",
			balance: "1 385 300",
		},
		{
			date: "23 April",
			principal: "xxxxx",
			interest: "xxxxx",
			balance: "xxxxx",
		},
		{
			date: "23 May",
			principal: "xxxxx",
			interest: "xxxxx",
			balance: "xxxxx",
		},
		{
			date: "23 June",
			principal: "xxxxx",
			interest: "xxxxx",
			balance: "xxxxx",
		},
	];

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
					<RepaymentScheduleGraph data={data} />
				</div>
			</div>
			{showTable && <RepaymentScheduleTable dataSource={dataSource} columns={columns} />}
		</div>
	);
};
