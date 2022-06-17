import { DAYS_IN_REPAYMENT_PERIOD } from "@consts";
import { Fraction } from "@credix/credix-client";
import { RepaymentSchedulePeriod } from "@credix_types/repaymentschedule.types";
import * as Amortization from "@utils/amortization.utils";
import * as Bullet from "@utils/bullet.utils";
import { round } from "@utils/format.utils";
import Big from "big.js";

const defaultPrincipal = 30_000;
const defaultRate = new Fraction(3, 100);
const defaultPeriods = 48;

describe("amortization", () => {
	test("it calculates the monthly payment", async () => {
		const principal = defaultPrincipal;
		const rate = defaultRate;
		const repaymentPeriod = defaultPeriods;
		const monthlyPayment = Amortization.calculateMonthlyPayment(principal, rate, repaymentPeriod);

		const expected = 664.03;

		await expect(monthlyPayment).toBe(expected);
	});

	test("it calculates the principal repayment", async () => {
		const principal = defaultPrincipal;
		const rate = defaultRate;
		const repaymentPeriod = defaultPeriods;
		const monthlyPayment = Amortization.calculateMonthlyPayment(principal, rate, repaymentPeriod);

		const principalPayment = Amortization.calculatePrincipalRepayment(
			monthlyPayment,
			principal,
			rate
		);

		const expected = 589.03;

		await expect(principalPayment).toBe(expected);
	});

	test("it calculates the repayment schedule", async () => {
		const periods = 12;
		const principal = defaultPrincipal;
		const financingFee = defaultRate;
		const repaymentPeriod = periods * DAYS_IN_REPAYMENT_PERIOD;
		const schedule = Amortization.repaymentSchedule(principal, financingFee, repaymentPeriod);

		const expected: RepaymentSchedulePeriod[] = [
			{
				cumulativeInterest: 75,
				cumulativePrincipal: 2465.81,
				principal: 2465.81,
				interest: 75,
			},
			{
				cumulativeInterest: 143.65,
				cumulativePrincipal: 4937.97,
				interest: 68.65,
				principal: 2472.16,
			},
			{
				cumulativeInterest: 205.95,
				cumulativePrincipal: 7416.48,
				interest: 62.3,
				principal: 2478.51,
			},
			{
				cumulativeInterest: 261.89,
				cumulativePrincipal: 9901.35,
				interest: 55.94,
				principal: 2484.87,
			},
			{
				cumulativeInterest: 311.48,
				cumulativePrincipal: 12392.57,
				interest: 49.59,
				principal: 2491.22,
			},
			{
				cumulativeInterest: 354.72,
				cumulativePrincipal: 14890.14,
				interest: 43.24,
				principal: 2497.57,
			},
			{
				cumulativeInterest: 391.61,
				cumulativePrincipal: 17394.06,
				interest: 36.89,
				principal: 2503.92,
			},
			{
				cumulativeInterest: 422.15,
				cumulativePrincipal: 19904.33,
				interest: 30.54,
				principal: 2510.27,
			},
			{
				cumulativeInterest: 446.33,
				cumulativePrincipal: 22420.96,
				interest: 24.18,
				principal: 2516.63,
			},
			{
				cumulativeInterest: 464.16,
				cumulativePrincipal: 24943.94,
				interest: 17.83,
				principal: 2522.98,
			},
			{
				cumulativeInterest: 475.64,
				cumulativePrincipal: 27473.27,
				interest: 11.48,
				principal: 2529.33,
			},
			{
				cumulativeInterest: 480.77,
				cumulativePrincipal: 30008.95,
				interest: 5.13,
				principal: 2535.68,
			},
		];

		await expect(schedule).toEqual(expected);
	});

	test("the principal and interest in the schedule add up to monthly payment", async () => {
		const periods = 12;
		const principal = defaultPrincipal;
		const financingFee = defaultRate;
		const repaymentPeriod = periods * DAYS_IN_REPAYMENT_PERIOD;
		const schedule = Amortization.repaymentSchedule(principal, financingFee, repaymentPeriod);
		const monthlyPayment = Amortization.calculateMonthlyPayment(principal, financingFee, periods);

		schedule.pop();

		schedule.forEach(async (repayment) => {
			await expect(
				round(new Big(repayment.principal + repayment.interest), Big.roundHalfEven).toNumber()
			).toBe(monthlyPayment);
		});
	});
});

describe("bullet", () => {
	test("it calculates the monthly payment", async () => {
		const principal = 100_000;
		const financingFee = new Fraction(12, 100);
		const numberOfPayments = 12;
		const monthlyPayment = Bullet.calculateMonthlyPayment(
			principal,
			financingFee,
			numberOfPayments
		);

		const expected = 1000;

		await expect(monthlyPayment).toBe(expected);
	});

	test("it calculates the repayment schedule", async () => {
		const principal = 100_000;
		const financingFee = new Fraction(12, 100);
		const numberOfPayments = 12 * DAYS_IN_REPAYMENT_PERIOD;

		const schedule = Bullet.repaymentSchedule(principal, financingFee, numberOfPayments);

		const expected: RepaymentSchedulePeriod[] = [
			{ principal: 0, interest: 1000, cumulativePrincipal: 0, cumulativeInterest: 1000 },
			{ principal: 0, interest: 1000, cumulativePrincipal: 0, cumulativeInterest: 2000 },
			{ principal: 0, interest: 1000, cumulativePrincipal: 0, cumulativeInterest: 3000 },
			{ principal: 0, interest: 1000, cumulativePrincipal: 0, cumulativeInterest: 4000 },
			{ principal: 0, interest: 1000, cumulativePrincipal: 0, cumulativeInterest: 5000 },
			{ principal: 0, interest: 1000, cumulativePrincipal: 0, cumulativeInterest: 6000 },
			{ principal: 0, interest: 1000, cumulativePrincipal: 0, cumulativeInterest: 7000 },
			{ principal: 0, interest: 1000, cumulativePrincipal: 0, cumulativeInterest: 8000 },
			{ principal: 0, interest: 1000, cumulativePrincipal: 0, cumulativeInterest: 9000 },
			{ principal: 0, interest: 1000, cumulativePrincipal: 0, cumulativeInterest: 10000 },
			{ principal: 0, interest: 1000, cumulativePrincipal: 0, cumulativeInterest: 11000 },
			{
				principal: 100_000,
				interest: 1000,
				cumulativePrincipal: 100_000,
				cumulativeInterest: 12_000,
			},
		];

		await expect(schedule).toEqual(expected);
	});
});
