import { Ratio } from "@credix/credix-client";
import { seniorAPR } from "@utils/tranche.utils";

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
