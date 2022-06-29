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
	const currentDate = new Date();
	const principal = schedule[schedule.length - 1].cumulativePrincipal;
	const interest = schedule[schedule.length - 1].cumulativeInterest;
	const totalToRepay = principal + interest;

	return schedule.reduce(
		(acc, repayment, index) => {
			const {
				interest: interestToRepay,
				principal: principalToRepay,
				cumulativeInterest,
				cumulativePrincipal,
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
				date: new Date(currentDate.getFullYear(), index + 1, 1),
				principal: principalToRepay,
				interest: interestToRepay,
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
