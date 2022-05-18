import { Ratio } from "@credix/credix-client";
import { calculateTotalInterest, seniorAPR } from "@utils/tranche.utils";

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
