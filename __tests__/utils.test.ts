import { formatDate, formatTimestamp, round } from "@utils/format.utils";
import Big from "big.js";

describe("date formatting", () => {
	it("formats a date", () => {
		const date = new Date(2022, 2, 23);
		const expected = "23/03/2022";
		expect(formatDate(date, ["nl-BE"])).toBe(expected);
	});

	it("formats a timestamp", () => {
		const timestamp = 1648056314;
		const expected = "23/03/2022";
		expect(formatTimestamp(timestamp, ["nl-BE"])).toBe(expected);
	});

	it("has a fallback when no locale is given", () => {
		const date = new Date(2022, 2, 23);
		const expected = "03/23/2022";
		expect(formatDate(date, [])).toBe(expected);
	});
});

describe("formatting", () => {
	test("Big numbers get rounded correctly", async () => {
		const value = new Big(100.1234);
		const expected = new Big(100.123);

		expect(round(value, Big.roundHalfEven, 3).eq(expected)).toBeTruthy();
	});

	test("rounding defaults to a precision of 2 digits", async () => {
		const value = new Big(100.123);
		const expected = new Big(100.12);

		expect(round(value, Big.roundHalfEven).eq(expected)).toBeTruthy();
	});
});
