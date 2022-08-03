import { Fraction } from "@credix/credix-client";
import {
	seniorAPR,
	calculateTotalInterest,
	twoTrancheSeniorPercentageOfPrincipal,
	twoTrancheJuniorAPR,
	twoTrancheJuniorPercentageOfPrincipal,
	twoTrancheJuniorPercentageOfInterest,
	twoTrancheSeniorPercentageOfInterest,
	threeTrancheSeniorPercentageOfPrincipal,
	threeTrancheSeniorPercentageOfInterest,
	threeTrancheMezAPR,
	threeTrancheMezPercentageOfPrincipal,
	threeTrancheMezPercentageOfInterest,
	threeTrancheJuniorAPR,
} from "@utils/tranche.utils";

describe("total interest", () => {
	it("calculates correctly", () => {
		const timeToMaturity = 360;
		const financingFee = new Fraction(10, 100);
		const principal = 1_000_000;

		const result = calculateTotalInterest(timeToMaturity, financingFee, principal);
		const expected = 100_000;

		expect(result.eq(expected));
	});
});

describe("one tranche", () => {
	it("calculates the senior apr", () => {
		const percentageOfInterest = new Fraction(100, 100);
		const percentageOfPrincipal = new Fraction(100, 100);
		const performanceFee = new Fraction(10, 100);
		const totalInterest = 150_000;
		const totalPrincipal = 1_000_000;
		const timeToMaturity = 360;

		const result = seniorAPR({
			percentageOfInterest,
			percentageOfPrincipal,
			performanceFee,
			totalInterest,
			totalPrincipal,
			timeToMaturity,
		});
		const expected = new Fraction(135, 1000);

		expect(result.equals(expected)).toBeTruthy();
	});
});

describe("two tranche", () => {
	it("calculates the senior apr", () => {
		const percentageOfInterest = new Fraction(50, 100);
		const percentageOfPrincipal = new Fraction(50, 100);
		const performanceFee = new Fraction(10, 100);
		const totalInterest = 150_000;
		const totalPrincipal = 1_000_000;
		const timeToMaturity = 360;

		const result = seniorAPR({
			percentageOfInterest,
			percentageOfPrincipal,
			performanceFee,
			totalInterest,
			totalPrincipal,
			timeToMaturity,
		});
		expect(result.equals(new Fraction(135, 1000))).toBeTruthy();
	});

	it("calculates the senior percentage of principal", () => {
		const percentageOfInterest = new Fraction(50, 100);
		const aprSenior = new Fraction(135, 1000);
		const performanceFee = new Fraction(10, 100);
		const totalInterest = 150_000;
		const totalPrincipal = 1_000_000;
		const timeToMaturity = 360;

		const result = twoTrancheSeniorPercentageOfPrincipal({
			percentageOfInterest,
			apr: aprSenior,
			performanceFee,
			totalInterest,
			totalPrincipal,
			timeToMaturity,
		});
		expect(result.equals(new Fraction(5, 10))).toBeTruthy();
	});

	it("calculates the senior percentage of interest", () => {
		const percentageOfPrincipal = new Fraction(50, 100);
		const aprSenior = new Fraction(135, 1000);
		const performanceFee = new Fraction(10, 100);
		const totalInterest = 150_000;
		const totalPrincipal = 1_000_000;
		const timeToMaturity = 360;

		const result = twoTrancheSeniorPercentageOfInterest({
			percentageOfPrincipal,
			apr: aprSenior,
			performanceFee,
			totalInterest,
			totalPrincipal,
			timeToMaturity,
		});
		expect(result.equals(new Fraction(5, 10))).toBeTruthy();
	});

	it("calculates the junior apr", () => {
		const percentageOfInterestSenior = new Fraction(50, 100);
		const percentageOfPrincipalSenior = new Fraction(50, 100);
		const performanceFee = new Fraction(10, 100);
		const totalInterest = 150_000;
		const totalPrincipal = 1_000_000;
		const timeToMaturity = 360;

		const result = twoTrancheJuniorAPR({
			percentageOfInterestSenior,
			percentageOfPrincipalSenior,
			performanceFee,
			totalInterest,
			totalPrincipal,
			timeToMaturity,
		});
		expect(result.equals(new Fraction(135, 1000))).toBeTruthy();
	});
	it("calculates the junior percentage of principal", () => {
		const percentageOfInterestSenior = new Fraction(50, 100);
		const aprJunior = new Fraction(250, 1000);
		const performanceFee = new Fraction(10, 100);
		const totalInterest = 150_000;
		const totalPrincipal = 1_000_000;
		const timeToMaturity = 360;

		const result = twoTrancheJuniorPercentageOfPrincipal({
			percentageOfInterestSenior,
			apr: aprJunior,
			performanceFee,
			totalInterest,
			totalPrincipal,
			timeToMaturity,
		});
		expect(result.equals(new Fraction(27, 100))).toBeTruthy();
	});

	it("calculates the junior percentage of interest", () => {
		const percentageOfPrincipalSenior = new Fraction(50, 100);
		const aprJunior = new Fraction(135, 1000);
		const performanceFee = new Fraction(10, 100);
		const totalInterest = 150_000;
		const totalPrincipal = 1_000_000;
		const timeToMaturity = 360;

		const result = twoTrancheJuniorPercentageOfInterest({
			percentageOfPrincipalSenior,
			apr: aprJunior,
			performanceFee,
			totalInterest,
			totalPrincipal,
			timeToMaturity,
		});
		const expected = new Fraction(5, 10);

		expect(result.equals(expected)).toBeTruthy();
	});
});

describe("three tranche", () => {
	it("calculates the senior apr", () => {
		const percentageOfInterest = new Fraction(50, 100);
		const percentageOfPrincipal = new Fraction(50, 100);
		const performanceFee = new Fraction(10, 100);
		const totalInterest = 150_000;
		const totalPrincipal = 1_000_000;
		const timeToMaturity = 360;

		const result = seniorAPR({
			percentageOfInterest,
			percentageOfPrincipal,
			performanceFee,
			totalInterest,
			totalPrincipal,
			timeToMaturity,
		});
		expect(result.equals(new Fraction(135, 1000))).toBeTruthy();
	});

	it("calculates the senior percentage of principal", () => {
		const percentageOfInterest = new Fraction(50, 100);
		const aprSenior = new Fraction(135, 1000);
		const performanceFee = new Fraction(10, 100);
		const totalInterest = 150_000;
		const totalPrincipal = 1_000_000;
		const timeToMaturity = 360;

		const result = threeTrancheSeniorPercentageOfPrincipal({
			percentageOfInterest,
			apr: aprSenior,
			performanceFee,
			totalInterest,
			totalPrincipal,
			timeToMaturity,
		});

		expect(result.equals(new Fraction(50, 100))).toBeTruthy();
	});

	it("calculates the senior percentage of interest", () => {
		const percentageOfPrincipal = new Fraction(50, 100);
		const aprSenior = new Fraction(135, 1000);
		const performanceFee = new Fraction(10, 100);
		const totalInterest = 150_000;
		const totalPrincipal = 1_000_000;
		const timeToMaturity = 360;

		const result = threeTrancheSeniorPercentageOfInterest({
			percentageOfPrincipal,
			apr: aprSenior,
			performanceFee,
			totalInterest,
			totalPrincipal,
			timeToMaturity,
		});

		expect(result.equals(new Fraction(50, 100))).toBeTruthy();
	});

	it("calculates the mez apr", () => {
		const percentageOfInterestMez = new Fraction(50, 100);
		const percentageOfPrincipalMez = new Fraction(50, 100);
		const performanceFee = new Fraction(10, 100);
		const totalInterest = 150_000;
		const totalPrincipal = 1_000_000;
		const timeToMaturity = 360;

		const result = threeTrancheMezAPR({
			percentageOfInterestMez,
			percentageOfPrincipalMez,
			performanceFee,
			totalInterest,
			totalPrincipal,
			timeToMaturity,
		});

		expect(result.equals(new Fraction(135, 1000))).toBeTruthy();
	});
	it("calculates the mez percentage of principal", () => {
		const percentageOfInterestMez = new Fraction(50, 100);
		const aprJunior = new Fraction(250, 1000);
		const performanceFee = new Fraction(10, 100);
		const totalInterest = 150_000;
		const totalPrincipal = 1_000_000;
		const timeToMaturity = 360;

		const result = threeTrancheMezPercentageOfPrincipal({
			percentageOfInterestMez,
			apr: aprJunior,
			performanceFee,
			totalInterest,
			totalPrincipal,
			timeToMaturity,
		});
		expect(result.equals(new Fraction(27, 100))).toBeTruthy();
	});
	it("calculates the mez percentage of interest", () => {
		const percentageOfPrincipalMez = new Fraction(50, 100);
		const aprJunior = new Fraction(135, 1000);
		const performanceFee = new Fraction(10, 100);
		const totalInterest = 150_000;
		const totalPrincipal = 1_000_000;
		const timeToMaturity = 360;

		const result = threeTrancheMezPercentageOfInterest({
			percentageOfPrincipalMez,
			apr: aprJunior,
			performanceFee,
			totalInterest,
			totalPrincipal,
			timeToMaturity,
		});

		expect(result.equals(new Fraction(5, 10))).toBeTruthy();
	});

	it("calculates the junior apr", () => {
		const percentageOfInterestSenior = new Fraction(20, 100);
		const percentageOfPrincipalSenior = new Fraction(15, 100);
		const percentageOfInterestMez = new Fraction(15, 100);
		const percentageOfPrincipalMez = new Fraction(20, 100);
		const performanceFee = new Fraction(10, 100);
		const totalInterest = 150_000;
		const totalPrincipal = 1_000_000;
		const timeToMaturity = 360;

		const result = threeTrancheJuniorAPR({
			percentageOfPrincipalSenior,
			percentageOfInterestSenior,
			percentageOfInterestMez,
			percentageOfPrincipalMez,
			performanceFee,
			totalInterest,
			totalPrincipal,
			timeToMaturity,
		});

		expect(result.equals(new Fraction(135, 1000))).toBeTruthy();
	});
});
