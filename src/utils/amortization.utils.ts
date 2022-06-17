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

	return round(monthlyPayment, Big.roundHalfEven).toNumber();
};

export const calculatePrincipalRepayment = (
	monthlyPayment: number,
	outstandingLoanBalance: number,
	interestRate: Fraction
) => {
	const monthlyInterestRate = new Fraction(interestRate.toNumber(), 12).toNumber();
	return round(
		new Big(monthlyPayment - outstandingLoanBalance * monthlyInterestRate),
		Big.roundHalfEven
	).toNumber();
};

export const repaymentSchedule = (
	principal: number,
	interestRate: Fraction,
	timeToMaturity: number
): RepaymentSchedulePeriod[] => {
	// TODO: check these calculations, something's off
	const paymentPeriods = Math.ceil(timeToMaturity / DAYS_IN_REPAYMENT_PERIOD);
	const monthlyPayment = calculateMonthlyPayment(principal, interestRate, paymentPeriods);
	const balance = principal;
	const schedule = <RepaymentSchedulePeriod[]>[];

	let cumulativeInterest = new Big(0);
	let cumulativePrincipal = new Big(0);

	for (let index = 1; index <= paymentPeriods; index++) {
		const principal = calculatePrincipalRepayment(
			monthlyPayment,
			balance - cumulativeInterest.toNumber() - cumulativePrincipal.toNumber(),
			interestRate
		);
		const interest = new Big(monthlyPayment - principal);
		cumulativeInterest = round(cumulativeInterest.add(interest), Big.roundHalfEven);
		cumulativePrincipal = cumulativePrincipal.add(principal);

		schedule.push({
			cumulativeInterest: cumulativeInterest.toNumber(),
			cumulativePrincipal: cumulativePrincipal.toNumber(),
			principal,
			interest: round(interest, Big.roundHalfEven).toNumber(),
		});
	}

	return schedule;
};
