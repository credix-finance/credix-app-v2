import { DAYS_IN_REPAYMENT_PERIOD, MONTHS_IN_YEAR } from "@consts";
import { Fraction, RepaymentPeriod } from "@credix/credix-client";
import { RepaymentSchedulePeriod } from "@credix_types/repaymentschedule.types";

export const calculateMonthlyPayment = (
	principal: number,
	rate: Fraction,
	paymentPeriods: number
) => {
	const totalInterest = principal * rate.toNumber();
	return totalInterest / paymentPeriods;
};

export const calculatePrincipalRepayment = (
	monthlyPayment: number,
	outstandingLoanBalance: number,
	rate: number
) => {
	return monthlyPayment - outstandingLoanBalance * (rate / MONTHS_IN_YEAR);
};

export const repaymentSchedule = (
	principal: number,
	rate: Fraction,
	timeToMaturity: number
): RepaymentSchedulePeriod[] => {
	const paymentPeriods = Math.ceil(timeToMaturity / DAYS_IN_REPAYMENT_PERIOD);
	const monthlyPayment = calculateMonthlyPayment(principal, rate, paymentPeriods);
	const schedule = <RepaymentSchedulePeriod[]>[];

	for (let index = 1; index < paymentPeriods; index++) {
		schedule.push({
			principal: 0,
			interest: monthlyPayment,
			cumulativeInterest: monthlyPayment * index,
			cumulativePrincipal: 0,
		});
	}

	schedule.push({
		principal,
		interest: monthlyPayment,
		cumulativeInterest: rate.apply(principal).toNumber(),
		cumulativePrincipal: principal,
	});

	return schedule;
};
