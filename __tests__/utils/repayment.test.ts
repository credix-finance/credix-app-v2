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
	test("it calculates the monthly payment", () => {
		const principal = defaultPrincipal;
		const rate = defaultRate;
		const repaymentPeriod = defaultPeriods;
		const monthlyPayment = Amortization.calculateMonthlyPayment(principal, rate, repaymentPeriod);

		const expected = "664.03";

		expect(round(Big(monthlyPayment), Big.roundHalfEven).eq(expected)).toBeTruthy();
	});

	test("it calculates the principal repayment", () => {
		const principal = defaultPrincipal;
		const rate = defaultRate;
		const repaymentPeriod = defaultPeriods;
		const monthlyPayment = Amortization.calculateMonthlyPayment(principal, rate, repaymentPeriod);

		const principalPayment = Amortization.calculatePrincipalRepayment(
			monthlyPayment,
			principal,
			rate
		);

		const expected = "589.03";

		expect(round(Big(principalPayment), Big.roundHalfEven).eq(expected)).toBeTruthy();
	});

	test("it calculates the repayment schedule", () => {
		const periods = 12;
		const principal = defaultPrincipal;
		const financingFee = defaultRate;
		const repaymentPeriod = periods * DAYS_IN_REPAYMENT_PERIOD;
		const schedule = Amortization.repaymentSchedule(principal, financingFee, repaymentPeriod);

		const expected: RepaymentSchedulePeriod[] = [
			{
				cumulativeInterest: 76,
				cumulativePrincipal: 2466,
				principal: 2466,
				interest: 76,
			},
			{
				cumulativeInterest: 145,
				cumulativePrincipal: 4938,
				interest: 69,
				principal: 2472,
			},
			{
				cumulativeInterest: 208,
				cumulativePrincipal: 7417,
				interest: 63,
				principal: 2479,
			},
			{
				cumulativeInterest: 265,
				cumulativePrincipal: 9902,
				interest: 57,
				principal: 2485,
			},
			{
				cumulativeInterest: 315,
				cumulativePrincipal: 12393,
				interest: 50,
				principal: 2491,
			},
			{
				cumulativeInterest: 359,
				cumulativePrincipal: 14889,
				interest: 44,
				principal: 2496,
			},
			{
				cumulativeInterest: 396,
				cumulativePrincipal: 17392,
				interest: 37,
				principal: 2503,
			},
			{
				cumulativeInterest: 427,
				cumulativePrincipal: 19901,
				interest: 31,
				principal: 2509,
			},
			{
				cumulativeInterest: 452,
				cumulativePrincipal: 22416,
				interest: 25,
				principal: 2515,
			},
			{
				cumulativeInterest: 470,
				cumulativePrincipal: 24937,
				interest: 18,
				principal: 2521,
			},
			{
				cumulativeInterest: 482,
				cumulativePrincipal: 27465,
				interest: 12,
				principal: 2528,
			},
			{
				cumulativeInterest: 489.73,
				cumulativePrincipal: 30000,
				interest: 7.73,
				principal: 2535,
			},
		];

		expect(schedule).toEqual(expected);
	});

	test("the sum of all the interest in the schedule adds up to the expected interest", () => {
		const periods = 12;
		const principal = defaultPrincipal;
		const financingFee = defaultRate;
		const repaymentPeriod = periods * DAYS_IN_REPAYMENT_PERIOD;
		const schedule = Amortization.repaymentSchedule(principal, financingFee, repaymentPeriod);
		const expectedInterest = "489.73";

		const interestSum = Big(schedule.reduce((acc, curr) => acc + curr.interest, 0));

		expect(interestSum.eq(expectedInterest)).toBeTruthy();
	});

	test("the sum of all the principal in the schedule adds up to the starting principal", () => {
		const periods = 12;
		const principal = defaultPrincipal;
		const financingFee = defaultRate;
		const repaymentPeriod = periods * DAYS_IN_REPAYMENT_PERIOD;
		const schedule = Amortization.repaymentSchedule(principal, financingFee, repaymentPeriod);

		const principalSum = Big(schedule.reduce((acc, curr) => acc + curr.principal, 0));

		expect(principalSum.eq(principal)).toBeTruthy();
	});
});

describe("bullet", () => {
	test("it calculates the monthly payment", () => {
		const principal = 100_000;
		const financingFee = new Fraction(12, 100);
		const numberOfPayments = 12;
		const timeToMaturity = 360;
		const monthlyPayment = Bullet.calculateMonthlyPayment(
			principal,
			financingFee,
			numberOfPayments,
			timeToMaturity
		);

		const expected = 1000;

		expect(monthlyPayment).toBe(expected);
	});

	test("it calculates the repayment schedule", () => {
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

		expect(schedule).toEqual(expected);
	});
});
