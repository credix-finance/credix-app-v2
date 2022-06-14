import { DAYS_IN_REPAYMENT_PERIOD } from "@consts";
import { Ratio } from "@credix/credix-client";
import Big from "big.js";
import { round } from "./format.utils";

export const calculateMonthlyPayment = (
	principal: number,
	interestRate: Ratio,
	numberOfPayments: number
) => {
	const monthlyInterestRate = new Ratio(interestRate.toNumber(), 12).toNumber();
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
	interestRate: Ratio
) => {
	const monthlyInterestRate = new Ratio(interestRate.toNumber(), 12).toNumber();
	return round(
		new Big(monthlyPayment - outstandingLoanBalance * monthlyInterestRate),
		Big.roundHalfEven
	).toNumber();
};

export interface Repayment {
	principal: number;
	interest: number;
	balance: number;
}
export const repaymentSchedule = (
	principal: number,
	interestRate: Ratio,
	timeToMaturity: number
): Repayment[] => {
	const paymentPeriods = Math.ceil(timeToMaturity / DAYS_IN_REPAYMENT_PERIOD);
	const monthlyPayment = calculateMonthlyPayment(principal, interestRate, paymentPeriods);
	let balance = principal;
	const schedule = [];

	for (let index = 1; index <= paymentPeriods; index++) {
		let principal = calculatePrincipalRepayment(monthlyPayment, balance, interestRate);
		const interest = round(new Big(monthlyPayment - principal), Big.roundHalfEven).toNumber();

		if (index === paymentPeriods) {
			principal = balance;
			balance = 0;
		} else {
			balance = round(new Big(balance).minus(principal), Big.roundHalfEven).toNumber();
		}

		schedule.push({
			balance,
			principal,
			interest,
		});
	}

	return schedule;
};
