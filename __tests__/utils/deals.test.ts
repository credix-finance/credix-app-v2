import { Deal, Fraction, RepaymentSchedule, Tranche, Tranches } from "@credix/credix-client";
import {
	calculateDaysRemainingRatio,
	calculateInterestRepaidRatio,
	calculateMonthlyRepaymentAmount,
	calculatePrincipalRepaidRatio,
} from "@utils/deal.utils";
import { daysToMilliseconds, ratioFormatter } from "@utils/format.utils";
import Big from "big.js";

describe("monthly repayment amount", () => {
	it("calculates the monthly repayment amount", () => {
		const repaymentSchedule = {
			totalInterest: 100_000_000,
			duration: 300,
		} as RepaymentSchedule;

		const expected = 10;
		const result = calculateMonthlyRepaymentAmount(repaymentSchedule);

		expect(result).toBe(expected);
	});

	it("returns if repaymentSchedule is null", () => {
		const repaymentSchedule = null;
		const expected = undefined;
		const result = calculateMonthlyRepaymentAmount(repaymentSchedule);

		expect(result).toBe(expected);
	});
});

describe("interest repaid ratio", () => {
	it("calculates the ratio", () => {
		const tranches = {
			tranches: [
				{
					interestRepaid: 25_000_000,
				},
				{
					interestRepaid: 25_000_000,
				},
			] as Tranche[],
		} as Tranches;

		const repaymentSchedule = {
			totalInterest: 100_000_000,
		} as RepaymentSchedule;

		const expected = new Fraction(50, 100);
		const result = calculateInterestRepaidRatio(tranches, repaymentSchedule);

		expect(result.equals(expected)).toBeTruthy();
	});
});

describe("principal repaid ratio", () => {
	it("calculates the ratio", () => {
		const tranches = {
			tranches: [
				{
					principalRepaid: 25_000_000,
				},
				{
					principalRepaid: 25_000_000,
				},
			] as Tranche[],
		} as Tranches;

		const repaymentSchedule = {
			totalPrincipal: 100_000_000,
		} as RepaymentSchedule;

		const expected = new Fraction(50, 100);
		const result = calculatePrincipalRepaidRatio(tranches, repaymentSchedule);

		expect(result.equals(expected)).toBeTruthy();
	});
});

describe("days remaining ratio", () => {
	it("calculates the ratio", () => {
		const durationInDays = 300;
		const goLiveAt = Math.trunc(
			(new Date().getTime() - daysToMilliseconds(durationInDays / 2)) / 1000
		);

		const deal = {
			goLiveAt,
		} as Deal;

		const repaymentSchedule = {
			duration: durationInDays,
		} as RepaymentSchedule;

		const expected = ratioFormatter.format(new Fraction(50, 100).toNumber());
		const result = calculateDaysRemainingRatio(deal, repaymentSchedule);

		expect(ratioFormatter.format(result.toNumber())).toEqual(expected);
	});
});
