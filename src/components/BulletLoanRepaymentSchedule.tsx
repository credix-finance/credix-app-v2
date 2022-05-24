import React, { FunctionComponent, ReactNode, useState } from "react";
import {
	RepaymentScheduleAmountType,
	RepaymentScheduleDataPoint,
	RepaymentScheduleGraph,
} from "./RepaymentScheduleGraph";
import { RepaymentScheduleTable } from "./RepaymentScheduleTable";
import { Button } from "./Button";
import { ColumnsProps } from "./Table";

interface BulletLoanRepaymentScheduleProps {
	children?: ReactNode;
}
export const BulletLoanRepaymentSchedule: FunctionComponent<
	BulletLoanRepaymentScheduleProps
> = () => {
	const [showTable, setShowTable] = useState(false);

	const data: RepaymentScheduleDataPoint[] = [];
	for (let i = 1; i <= 11; i++) {
		data.push({
			month: i.toString(),
			type: RepaymentScheduleAmountType.PRINCIPAL,
			amount: 0,
		});

		data.push({
			month: i.toString(),
			type: RepaymentScheduleAmountType.INTEREST,
			amount: 10,
		});
	}
	data.push({
		month: "12",
		type: RepaymentScheduleAmountType.PRINCIPAL,
		amount: 90,
	});
	data.push({
		month: "12",
		type: RepaymentScheduleAmountType.INTEREST,
		amount: 10,
	});

	const dataSource = [
		{
			date: "23 January",
			principal: "0",
			interest: "20 000",
			balance: "1 980 000",
		},
		{
			date: "23 Febrary",
			principal: "0",
			interest: "20 000",
			balance: "1 960 000",
		},
		{
			date: "23 March",
			principal: "0",
			interest: "20 000",
			balance: "1 940 000",
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
