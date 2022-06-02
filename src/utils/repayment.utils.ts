import { RepaymentScheduleAmountType } from "@credix_types/repaymentschedule.types";
import { Repayment } from "@utils/amortization.utils";

export const generateGraphAndTableData = (schedule: Repayment[]) => {
	const currentDate = new Date();

	return schedule.reduce(
		(acc, repayment, index) => {
			const { interest, principal, balance } = repayment;
			const month = (index + 1).toString();

			acc.graphData.push({
				month,
				type: RepaymentScheduleAmountType.INTEREST,
				amount: interest,
			});
			acc.graphData.push({
				month,
				type: RepaymentScheduleAmountType.PRINCIPAL,
				amount: principal,
			});

			acc.dataSource.push({
				date: new Date(currentDate.getFullYear(), index + 1, 1),
				principal: principal.toString(),
				interest: interest.toString(),
				balance: balance.toString(),
			});

			return acc;
		},
		{ graphData: [], dataSource: [] }
	);
};
