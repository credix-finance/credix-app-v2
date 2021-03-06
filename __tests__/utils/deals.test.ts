import { Deal, Fraction, RepaymentSchedule } from "@credix/credix-client";
import {
	calculateDaysRemainingRatio,
	calculateInterestRepaidRatio,
	calculateMonthlyRepaymentAmount,
	calculatePrincipalRepaidRatio,
	totalMissingAmount,
	interestToRepay,
} from "@utils/deal.utils";
import { daysToMilliseconds, ratioFormatter } from "@utils/format.utils";

describe("monthly repayment amount", () => {
	it("calculates the monthly repayment amount", () => {
		const repaymentSchedule = {
			totalInterest: {
				uiAmount: 100_000_000,
			},
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
		const repaymentSchedule = {
			periods: [
				{
					interestRepaid: {
						uiAmount: 50_000_000,
					},
				},
			],
			totalInterest: {
				uiAmount: 100_000_000,
			},
		} as RepaymentSchedule;

		const expected = new Fraction(50, 100);
		const result = calculateInterestRepaidRatio(repaymentSchedule);

		expect(result.equals(expected)).toBeTruthy();
	});
});

describe("principal repaid ratio", () => {
	it("calculates the ratio", () => {
		const repaymentSchedule = {
			periods: [
				{
					principalRepaid: {
						uiAmount: 50_000_000,
					},
				},
			],
			totalPrincipal: {
				uiAmount: 100_000_000,
			},
		} as RepaymentSchedule;

		const expected = new Fraction(50, 100);
		const result = calculatePrincipalRepaidRatio(repaymentSchedule);

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

describe("interest to repay", () => {
	it("calculates the interest to repay", async () => {
		const repaymentSchedule = {
			totalInterest: {
				uiAmount: 100_000_000,
			},
			periods: [
				{
					interestRepaid: {
						uiAmount: 10_000_000,
					},
				},
				{
					interestRepaid: {
						uiAmount: 10_000_000,
					},
				},
			],
		} as RepaymentSchedule;

		const expected = 80_000_000;
		const result = interestToRepay(repaymentSchedule);

		expect(result).toBe(expected);
	});
});

describe("total missing amount", () => {
	it("calculates the total missing amount", () => {
		const repaymentSchedule = {
			periods: [
				{
					totalToRepay: {
						uiAmount: 100_000_000,
					},
				},
				{
					totalToRepay: {
						uiAmount: 100_000_000,
					},
				},
			],
		} as RepaymentSchedule;
		const expected = 200_000_000;

		const result = totalMissingAmount(repaymentSchedule);

		expect(result).toBe(expected);
	});
});
