import { DAYS_IN_REPAYMENT_PERIOD } from "@consts";
import { Ratio } from "@credix/credix-client";
import * as Amortization from "@utils/amortization.utils";
import { round } from "@utils/format.utils";
import Big from "big.js";

const defaultPrincipal = 30_000;
const defaultRate = new Ratio(3, 100);
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

		const expected = [
			{
				balance: 27534.19,
				principal: 2465.81,
				interest: 75,
			},
			{
				balance: 25062.22,
				principal: 2471.97,
				interest: 68.84,
			},
			{
				balance: 22584.07,
				interest: 62.66,
				principal: 2478.15,
			},
			{
				balance: 20099.72,
				interest: 56.46,
				principal: 2484.35,
			},
			{
				balance: 17609.16,
				interest: 50.25,
				principal: 2490.56,
			},
			{
				balance: 15112.37,
				interest: 44.02,
				principal: 2496.79,
			},
			{
				balance: 12609.34,
				interest: 37.78,
				principal: 2503.03,
			},
			{
				balance: 10100.05,
				interest: 31.52,
				principal: 2509.29,
			},
			{
				balance: 7584.49,
				interest: 25.25,
				principal: 2515.56,
			},
			{
				balance: 5062.64,
				interest: 18.96,
				principal: 2521.85,
			},
			{
				balance: 2534.49,
				interest: 12.66,
				principal: 2528.15,
			},
			{
				balance: 0,
				principal: 2534.49,
				interest: 6.34,
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
