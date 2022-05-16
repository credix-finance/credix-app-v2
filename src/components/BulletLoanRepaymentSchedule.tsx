import React, { FunctionComponent, ReactNode, useEffect, useState } from "react";
import { RepaymentScheduleGraph } from "./RepaymentScheduleGraph";
import { RepaymentScheduleTable } from "./RepaymentScheduleTable";
import { Button } from "./Button";
import {
	RepaymentScheduleGraphDataPoint,
	RepaymentScheduleTableDataPoint,
} from "@credix_types/repaymentschedule.types";
import { useIntl } from "react-intl";
import { repaymentSchedule } from "@utils/bullet.utils";
import { Ratio } from "@credix/credix-client";
import { generateGraphAndTableData } from "@utils/repayment.utils";

interface BulletLoanRepaymentScheduleProps {
	principal: number;
	financingFee: number;
	repaymentPeriod: number;
	children?: ReactNode;
}
export const BulletLoanRepaymentSchedule: FunctionComponent<BulletLoanRepaymentScheduleProps> = ({
	repaymentPeriod,
	principal,
	financingFee,
}) => {
	const intl = useIntl();
	const [showTable, setShowTable] = useState(false);
	const [graphData, setGraphData] = useState<RepaymentScheduleGraphDataPoint[]>([]);
	const [dataSource, setDataSource] = useState<RepaymentScheduleTableDataPoint[]>();

	useEffect(() => {
		if (principal && financingFee && repaymentPeriod) {
			const financingFeeRatio = new Ratio(financingFee, 100);
			const schedule = repaymentSchedule(principal, financingFeeRatio, repaymentPeriod);

			const { graphData, dataSource } = generateGraphAndTableData(schedule);
			setGraphData(graphData);
			setDataSource(dataSource);
		}
	}, [principal, financingFee, repaymentPeriod]);

	return (
		<div>
			<div className="grid grid-cols-2 gap-x-20 mb-8">
				<div className="flex flex-col justify-between">
					<div>
						<Button onClick={() => setShowTable(!showTable)} type="text">
							{showTable &&
								intl.formatMessage({
									defaultMessage: "Hide table",
									description: "Deal form: repayment schedule hide table button",
								})}
							{!showTable &&
								intl.formatMessage({
									defaultMessage: "Show table",
									description: "Deal form: repayment schedule show table button",
								})}
						</Button>
					</div>
				</div>
				<div className="text-right">
					<RepaymentScheduleGraph data={graphData} />
				</div>
			</div>
			{showTable && <RepaymentScheduleTable dataSource={dataSource} />}
		</div>
	);
};
