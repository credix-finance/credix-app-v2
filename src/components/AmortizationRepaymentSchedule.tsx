import React, { FunctionComponent, ReactNode, useEffect, useState } from "react";
import {
	RepaymentScheduleGraphDataPoint,
	RepaymentScheduleTableDataPoint,
} from "@credix_types/repaymentschedule.types";
import { repaymentSchedule as generateRepaymentSchedule } from "@utils/amortization.utils";
import { generateGraphAndTableData } from "@utils/repayment.utils";
import { Fraction, RepaymentSchedule as RepaymentScheduleType } from "@credix/credix-client";
import { RepaymentSchedule } from "./RepaymentSchedule";

interface AmortizationRepaymentScheduleProps {
	principal?: number;
	interest?: number;
	repaymentSchedule?: RepaymentScheduleType;
	financingFee?: number;
	timeToMaturity?: number;
	children?: ReactNode;
}

export const AmortizationRepaymentSchedule: FunctionComponent<
	AmortizationRepaymentScheduleProps
> = ({ timeToMaturity, principal, financingFee, interest, repaymentSchedule }) => {
	const [graphData, setGraphData] = useState<RepaymentScheduleGraphDataPoint[]>([]);
	const [dataSource, setDataSource] = useState<RepaymentScheduleTableDataPoint[]>();

	useEffect(() => {
		if (repaymentSchedule) {
			const { graphData, dataSource } = generateGraphAndTableData(
				repaymentSchedule.periods.map((p) => ({
					cumulativeInterest: p.cumulativeInterest.uiAmount,
					cumulativePrincipal: p.cumulativePrincipal.uiAmount,
					interest: p.interest.uiAmount,
					principal: p.principal.uiAmount,
				})),
				repaymentSchedule.totalPrincipal.uiAmount,
				repaymentSchedule.totalInterest.uiAmount
			);
			setGraphData(graphData);
			setDataSource(dataSource);
		} else if (principal && financingFee && timeToMaturity) {
			const financingFeeRatio = new Fraction(financingFee, 100);
			const schedule = generateRepaymentSchedule(principal, financingFeeRatio, timeToMaturity);

			const { graphData, dataSource } = generateGraphAndTableData(
				schedule,
				principal,
				financingFeeRatio.apply(principal).toNumber()
			);
			setGraphData(graphData);
			setDataSource(dataSource);
		}
	}, [principal, financingFee, timeToMaturity, repaymentSchedule, interest]);

	return <RepaymentSchedule graphData={graphData} dataSource={dataSource} />;
};
