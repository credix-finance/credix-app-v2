import React, { FunctionComponent, ReactNode, useEffect, useState } from "react";
import {
	RepaymentScheduleGraphDataPoint,
	RepaymentScheduleTableDataPoint,
} from "@credix_types/repaymentschedule.types";
import { repaymentSchedule } from "@utils/bullet.utils";
import { Fraction } from "@credix/credix-client";
import { generateGraphAndTableData } from "@utils/repayment.utils";
import { RepaymentSchedule } from "./RepaymentSchedule";
import { logScaleGraphConfig } from "./RepaymentScheduleGraph";

interface BulletLoanRepaymentScheduleProps {
	principal: number;
	financingFee: number;
	timeToMaturity: number;
	children?: ReactNode;
}
export const BulletLoanRepaymentSchedule: FunctionComponent<BulletLoanRepaymentScheduleProps> = ({
	timeToMaturity,
	principal,
	financingFee,
}) => {
	const [graphData, setGraphData] = useState<RepaymentScheduleGraphDataPoint[]>([]);
	const [dataSource, setDataSource] = useState<RepaymentScheduleTableDataPoint[]>();

	useEffect(() => {
		if (principal && financingFee && timeToMaturity) {
			const financingFeeRatio = new Fraction(financingFee, 100);
			const schedule = repaymentSchedule(principal, financingFeeRatio, timeToMaturity);

			const { graphData, dataSource } = generateGraphAndTableData(schedule);
			setGraphData(graphData);
			setDataSource(dataSource);
		}
	}, [principal, financingFee, timeToMaturity]);

	return (
		<RepaymentSchedule
			graphData={graphData}
			graphConfig={logScaleGraphConfig}
			dataSource={dataSource}
		/>
	);
};
