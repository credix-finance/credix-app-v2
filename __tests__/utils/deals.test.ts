import { Deal, Fraction } from "@credix/credix-client";
import {
	calculateDaysRemainingRatio,
	calculateInterestRepaidRatio,
	calculateMonthlyRepaymentAmount,
	calculatePrincipalRepaidRatio,
} from "@utils/deal.utils";
import Big from "big.js";

describe("monthly repayment amount", () => {
	it("calculates the monthly repayment amount", () => {
		const deal = {
			totalInterest: new Big(100_000_000),
			timeToMaturity: 300,
		} as Deal;
		const expected = 10;
		const result = calculateMonthlyRepaymentAmount(deal);

		expect(result).toBe(expected);
	});

	it("returns if deal is null", () => {
		const deal = null;
		const expected = undefined;
		const result = calculateMonthlyRepaymentAmount(deal);

		expect(result).toBe(expected);
	});
});

describe("interest repaid ratio", () => {
	it("calculates the ratio", () => {
		const deal = {
			interestRepaid: 50_000_000,
			totalInterest: new Big(100_000_000),
		} as Deal;
		const expected = new Fraction(50, 100);
		const result = calculateInterestRepaidRatio(deal);

		expect(result.equals(expected)).toBeTruthy();
	});
});

describe("principal repaid ratio", () => {
	it("calculates the ratio", () => {
		const deal = {
			principalAmountRepaid: 50_000_000,
			principal: 100_000_000,
		} as Deal;
		const expected = new Fraction(50, 100);
		const result = calculatePrincipalRepaidRatio(deal);

		expect(result.equals(expected)).toBeTruthy();
	});
});

describe("days remaining ratio", () => {
	it("calculates the ratio", () => {
		const deal = {
			daysRemaining: 150,
			timeToMaturity: 300,
		} as Deal;
		const expected = new Fraction(50, 100);
		const result = calculateDaysRemainingRatio(deal);

		expect(result.equals(expected)).toBeTruthy();
	});
});
