import { DAYS_IN_REPAYMENT_PERIOD } from "@consts";
import { RepaymentSchedule } from "@credix/credix-client";
import {
	RepaymentScheduleAmountType,
	RepaymentSchedulePeriod,
	RepaymentScheduleType,
} from "@credix_types/repaymentschedule.types";
import {
	RepaymentScheduleGraphDataPoint,
	RepaymentScheduleTableDataPoint,
} from "@credix_types/repaymentschedule.types";

export const generateGraphAndTableData = (schedule: RepaymentSchedulePeriod[]) => {
	const principal = schedule[schedule.length - 1].cumulativePrincipal;
	const interest = schedule[schedule.length - 1].cumulativeInterest;
	const totalToRepay = principal + interest;

	return schedule.reduce(
		(acc, repayment, index) => {
			const {
				day,
				interest: interestToRepay,
				principal: principalToRepay,
				cumulativeInterest,
				cumulativePrincipal,
				repaid,
			} = repayment;
			const month = (index + 1).toString();

			acc.graphData.push({
				month,
				type: RepaymentScheduleAmountType.INTEREST,
				amount: interestToRepay,
			});
			acc.graphData.push({
				month,
				type: RepaymentScheduleAmountType.PRINCIPAL,
				amount: principalToRepay,
			});

			acc.dataSource.push({
				day: day ? day : (index + 1) * DAYS_IN_REPAYMENT_PERIOD,
				principal: principalToRepay,
				interest: interestToRepay,
				repaid,
				balance: totalToRepay - (cumulativeInterest + cumulativePrincipal),
			});

			return acc;
		},
		{ graphData: [], dataSource: [] } as {
			graphData: RepaymentScheduleGraphDataPoint[];
			dataSource: RepaymentScheduleTableDataPoint[];
		}
	);
};

export const repaymentScheduleType = (repaymentSchedule: RepaymentSchedule) => {
	if (repaymentSchedule.periods[0].principal.uiAmount === 0) {
		return RepaymentScheduleType.BULLET;
	}

	return RepaymentScheduleType.AMORTIZATION;
};
