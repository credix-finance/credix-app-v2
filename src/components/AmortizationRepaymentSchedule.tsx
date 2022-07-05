import React, { FunctionComponent, ReactNode, useEffect, useState } from "react";
import {
	RepaymentScheduleGraphDataPoint,
	RepaymentScheduleTableDataPoint,
} from "@credix_types/repaymentschedule.types";
import { repaymentSchedule } from "@utils/amortization.utils";
import { generateGraphAndTableData } from "@utils/repayment.utils";
import { Fraction } from "@credix/credix-client";
import { RepaymentSchedule } from "./RepaymentSchedule";

interface AmortizationRepaymentScheduleProps {
	principal: number;
	financingFee: number;
	timeToMaturity: number;
	children?: ReactNode;
}

export const AmortizationRepaymentSchedule: FunctionComponent<
	AmortizationRepaymentScheduleProps
> = ({ timeToMaturity, principal, financingFee }) => {
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

	return <RepaymentSchedule graphData={graphData} dataSource={dataSource} />;
};
