import { Ratio } from "@credix/credix-client";
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
		const financingFee = new Ratio(10, 100);
		const principal = 1_000_000;

		const result = calculateTotalInterest(timeToMaturity, financingFee, principal);
		const expected = 100_000;

		expect(result.eq(expected));
	});
});

describe("one tranche", () => {
	it("calculates the senior apr", () => {
		const percentageOfInterest = new Ratio(100, 100);
		const percentageOfPrincipal = new Ratio(100, 100);
		const interestFee = new Ratio(10, 100);
		const totalInterest = 150_000;
		const totalPrincipal = 1_000_000;
		const timeToMaturity = 360;

		const result = seniorAPR({
			percentageOfInterest,
			percentageOfPrincipal,
			interestFee,
			totalInterest,
			totalPrincipal,
			timeToMaturity,
		});
		const expected = new Ratio(135, 1000);

		expect(result.equals(expected)).toBeTruthy();
	});
});

describe("two tranche", () => {
	it("calculates the senior apr", () => {
		const percentageOfInterest = new Ratio(50, 100);
		const percentageOfPrincipal = new Ratio(50, 100);
		const interestFee = new Ratio(10, 100);
		const totalInterest = 150_000;
		const totalPrincipal = 1_000_000;
		const timeToMaturity = 360;

		const result = seniorAPR({
			percentageOfInterest,
			percentageOfPrincipal,
			interestFee,
			totalInterest,
			totalPrincipal,
			timeToMaturity,
		});
		expect(result.equals(new Ratio(135, 1000))).toBeTruthy();
	});

	it("calculates the senior percentage of principal", () => {
		const percentageOfInterest = new Ratio(50, 100);
		const aprSenior = new Ratio(135, 1000);
		const interestFee = new Ratio(10, 100);
		const totalInterest = 150_000;
		const totalPrincipal = 1_000_000;
		const timeToMaturity = 360;

		const result = twoTrancheSeniorPercentageOfPrincipal({
			percentageOfInterest,
			apr: aprSenior,
			interestFee,
			totalInterest,
			totalPrincipal,
			timeToMaturity,
		});
		expect(result.equals(new Ratio(5, 10))).toBeTruthy();
	});

	it("calculates the senior percentage of interest", () => {
		const percentageOfPrincipal = new Ratio(50, 100);
		const aprSenior = new Ratio(135, 1000);
		const interestFee = new Ratio(10, 100);
		const totalInterest = 150_000;
		const totalPrincipal = 1_000_000;
		const timeToMaturity = 360;

		const result = twoTrancheSeniorPercentageOfInterest({
			percentageOfPrincipal,
			apr: aprSenior,
			interestFee,
			totalInterest,
			totalPrincipal,
			timeToMaturity,
		});
		expect(result.equals(new Ratio(5, 10))).toBeTruthy();
	});

	it("calculates the junior apr", () => {
		const percentageOfInterestSenior = new Ratio(50, 100);
		const percentageOfPrincipalSenior = new Ratio(50, 100);
		const interestFee = new Ratio(10, 100);
		const totalInterest = 150_000;
		const totalPrincipal = 1_000_000;
		const timeToMaturity = 360;

		const result = twoTrancheJuniorAPR({
			percentageOfInterestSenior,
			percentageOfPrincipalSenior,
			interestFee,
			totalInterest,
			totalPrincipal,
			timeToMaturity,
		});
		expect(result.equals(new Ratio(135, 1000))).toBeTruthy();
	});
	it("calculates the junior percentage of principal", () => {
		const percentageOfInterestSenior = new Ratio(50, 100);
		const aprJunior = new Ratio(250, 1000);
		const interestFee = new Ratio(10, 100);
		const totalInterest = 150_000;
		const totalPrincipal = 1_000_000;
		const timeToMaturity = 360;

		const result = twoTrancheJuniorPercentageOfPrincipal({
			percentageOfInterestSenior,
			apr: aprJunior,
			interestFee,
			totalInterest,
			totalPrincipal,
			timeToMaturity,
		});
		expect(result.equals(new Ratio(27, 100))).toBeTruthy();
	});

	it("calculates the junior percentage of interest", () => {
		const percentageOfPrincipalSenior = new Ratio(50, 100);
		const aprJunior = new Ratio(135, 1000);
		const interestFee = new Ratio(10, 100);
		const totalInterest = 150_000;
		const totalPrincipal = 1_000_000;
		const timeToMaturity = 360;

		const result = twoTrancheJuniorPercentageOfInterest({
			percentageOfPrincipalSenior,
			apr: aprJunior,
			interestFee,
			totalInterest,
			totalPrincipal,
			timeToMaturity,
		});
		const expected = new Ratio(5, 10);

		expect(result.equals(expected)).toBeTruthy();
	});
});

describe("three tranche", () => {
	it("calculates the senior apr", () => {
		const percentageOfInterest = new Ratio(50, 100);
		const percentageOfPrincipal = new Ratio(50, 100);
		const interestFee = new Ratio(10, 100);
		const totalInterest = 150_000;
		const totalPrincipal = 1_000_000;
		const timeToMaturity = 360;

		const result = seniorAPR({
			percentageOfInterest,
			percentageOfPrincipal,
			interestFee,
			totalInterest,
			totalPrincipal,
			timeToMaturity,
		});
		expect(result.equals(new Ratio(135, 1000))).toBeTruthy();
	});

	it("calculates the senior percentage of principal", () => {
		const percentageOfInterest = new Ratio(50, 100);
		const aprSenior = new Ratio(135, 1000);
		const interestFee = new Ratio(10, 100);
		const totalInterest = 150_000;
		const totalPrincipal = 1_000_000;
		const timeToMaturity = 360;

		const result = threeTrancheSeniorPercentageOfPrincipal({
			percentageOfInterest,
			apr: aprSenior,
			interestFee,
			totalInterest,
			totalPrincipal,
			timeToMaturity,
		});

		expect(result.equals(new Ratio(50, 100))).toBeTruthy();
	});

	it("calculates the senior percentage of interest", () => {
		const percentageOfPrincipal = new Ratio(50, 100);
		const aprSenior = new Ratio(135, 1000);
		const interestFee = new Ratio(10, 100);
		const totalInterest = 150_000;
		const totalPrincipal = 1_000_000;
		const timeToMaturity = 360;

		const result = threeTrancheSeniorPercentageOfInterest({
			percentageOfPrincipal,
			apr: aprSenior,
			interestFee,
			totalInterest,
			totalPrincipal,
			timeToMaturity,
		});

		expect(result.equals(new Ratio(50, 100))).toBeTruthy();
	});

	it("calculates the mez apr", () => {
		const percentageOfInterestMez = new Ratio(50, 100);
		const percentageOfPrincipalMez = new Ratio(50, 100);
		const interestFee = new Ratio(10, 100);
		const totalInterest = 150_000;
		const totalPrincipal = 1_000_000;
		const timeToMaturity = 360;

		const result = threeTrancheMezAPR({
			percentageOfInterestMez,
			percentageOfPrincipalMez,
			interestFee,
			totalInterest,
			totalPrincipal,
			timeToMaturity,
		});

		expect(result.equals(new Ratio(135, 1000))).toBeTruthy();
	});
	it("calculates the mez percentage of principal", () => {
		const percentageOfInterestMez = new Ratio(50, 100);
		const aprJunior = new Ratio(250, 1000);
		const interestFee = new Ratio(10, 100);
		const totalInterest = 150_000;
		const totalPrincipal = 1_000_000;
		const timeToMaturity = 360;

		const result = threeTrancheMezPercentageOfPrincipal({
			percentageOfInterestMez,
			apr: aprJunior,
			interestFee,
			totalInterest,
			totalPrincipal,
			timeToMaturity,
		});
		expect(result.equals(new Ratio(27, 100))).toBeTruthy();
	});
	it("calculates the mez percentage of interest", () => {
		const percentageOfPrincipalMez = new Ratio(50, 100);
		const aprJunior = new Ratio(135, 1000);
		const interestFee = new Ratio(10, 100);
		const totalInterest = 150_000;
		const totalPrincipal = 1_000_000;
		const timeToMaturity = 360;

		const result = threeTrancheMezPercentageOfInterest({
			percentageOfPrincipalMez,
			apr: aprJunior,
			interestFee,
			totalInterest,
			totalPrincipal,
			timeToMaturity,
		});

		expect(result.equals(new Ratio(5, 10))).toBeTruthy();
	});

	it("calculates the junior apr", () => {
		const percentageOfInterestSenior = new Ratio(20, 100);
		const percentageOfPrincipalSenior = new Ratio(15, 100);
		const percentageOfInterestMez = new Ratio(15, 100);
		const percentageOfPrincipalMez = new Ratio(20, 100);
		const interestFee = new Ratio(10, 100);
		const totalInterest = 150_000;
		const totalPrincipal = 1_000_000;
		const timeToMaturity = 360;

		const result = threeTrancheJuniorAPR({
			percentageOfPrincipalSenior,
			percentageOfInterestSenior,
			percentageOfInterestMez,
			percentageOfPrincipalMez,
			interestFee,
			totalInterest,
			totalPrincipal,
			timeToMaturity,
		});

		expect(result.equals(new Ratio(135, 1000))).toBeTruthy();
	});
});
