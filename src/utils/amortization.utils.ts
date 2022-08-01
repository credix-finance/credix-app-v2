import { DAYS_IN_REPAYMENT_PERIOD } from "@consts";
import { Fraction } from "@credix/credix-client";
import { RepaymentSchedulePeriod } from "@credix_types/repaymentschedule.types";
import Big from "big.js";
import { round } from "./format.utils";

export const calculateMonthlyPayment = (
	principal: number,
	interestRate: Fraction,
	numberOfPayments: number
) => {
	const monthlyInterestRate = new Fraction(interestRate.toNumber(), 12).toNumber();
	const bigPrincipal = new Big(principal);
	const bigInterestRate = new Big(monthlyInterestRate);

	const denominator = Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1;
	const monthlyPayment = bigPrincipal
		.times(bigInterestRate.times(new Big(1 + monthlyInterestRate).pow(numberOfPayments)))
		.div(denominator || 1);

	return monthlyPayment.toNumber();
};

export const calculatePrincipalRepayment = (
	monthlyPayment: number,
	outstandingLoanBalance: number,
	interestRate: Fraction
) => {
	const monthlyInterestRate = new Fraction(interestRate.toNumber(), 12).toNumber();
	return new Big(monthlyPayment)
		.minus(Big(outstandingLoanBalance).times(monthlyInterestRate))
		.toNumber();
};

export const repaymentSchedule = (
	principal: number,
	interestRate: Fraction,
	timeToMaturity: number
): RepaymentSchedulePeriod[] => {
	const paymentPeriods = Math.ceil(timeToMaturity / DAYS_IN_REPAYMENT_PERIOD);
	const monthlyPayment = calculateMonthlyPayment(principal, interestRate, paymentPeriods);
	const balance = principal;
	let schedule = <RepaymentSchedulePeriod[]>[];

	// Calculate the exact schedule
	let cumulativeInterest = 0;
	let cumulativePrincipal = 0;
	for (let index = 1; index <= paymentPeriods; index++) {
		const outstandingLoanBalance = balance - cumulativePrincipal;
		const principal = calculatePrincipalRepayment(
			monthlyPayment,
			outstandingLoanBalance,
			interestRate
		);
		const interest = monthlyPayment - principal;
		cumulativeInterest = cumulativeInterest + interest;
		cumulativePrincipal = cumulativePrincipal + principal;

		schedule.push({
			cumulativeInterest: cumulativeInterest,
			cumulativePrincipal: cumulativePrincipal,
			principal: principal,
			interest: interest,
		});
	}

	// floor everything and sum up the rest values
	let cumulativeInterestRest = 0;
	let cumulativePrincipalRest = 0;
	schedule = schedule.map((period) => {
		const flooredPrincipal = Math.floor(period.principal);
		const flooredInterest = Math.floor(period.interest);

		cumulativePrincipalRest += period.principal - flooredPrincipal;
		cumulativeInterestRest += period.interest - flooredInterest;

		return {
			...period,
			interest: flooredInterest,
			principal: flooredPrincipal,
		};
	});

	// spread the rest principal values over the periods
	let principalIndex = paymentPeriods - 1;
	while (cumulativePrincipalRest > 0) {
		if (cumulativePrincipalRest > 1) {
			schedule[principalIndex % paymentPeriods].principal++;
		} else {
			schedule[paymentPeriods - 1].principal += round(
				Big(cumulativePrincipalRest),
				Big.roundHalfEven
			).toNumber();
		}

		cumulativePrincipalRest--;
		principalIndex++;
	}

	// spread the rest interest values over the periods
	let interestIndex = paymentPeriods - 1;
	while (cumulativeInterestRest > 0) {
		if (cumulativeInterestRest > 1) {
			schedule[interestIndex % paymentPeriods].interest++;
		} else {
			schedule[paymentPeriods - 1].interest += round(
				Big(cumulativeInterestRest),
				Big.roundDown
			).toNumber();
		}

		cumulativeInterestRest--;
		interestIndex++;
	}

	// Recalculate the cumulative values
	cumulativeInterest = 0;
	cumulativePrincipal = 0;
	schedule = schedule.map((period) => {
		cumulativeInterest += period.interest;
		cumulativePrincipal += period.principal;

		return {
			...period,
			cumulativePrincipal,
			cumulativeInterest,
		};
	});

	return schedule;
};
