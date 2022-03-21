import Big from "big.js";
import {
	formatDate,
	formatTimestamp,
	round,
	clamp,
	numberFormatter,
	ratioFormatter,
} from "@utils/format.utils";

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

describe("Format utils", () => {
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

	test("clamp value less than min returns min", () => {
		const value = 10;
		const min = 20;
		const max = 100;
		const clampedValue = clamp(value, min, max);

		expect(clampedValue).toBe(min);
	});

	test("clamp value greater than max returns max", () => {
		const value = 200;
		const min = 20;
		const max = 100;
		const clampedValue = clamp(value, min, max);

		expect(clampedValue).toBe(max);
	});

	test("clamp value between min and max returns value", () => {
		const value = 50;
		const min = 20;
		const max = 100;
		const clampedValue = clamp(value, min, max);

		expect(clampedValue).toBe(value);
	});

	test("numbers representing currency are formatted correctly", () => {
		const expected = "200.3";
		let value = 200.3;
		let formattedValue = numberFormatter.format(value);

		expect(formattedValue).toBe(expected);

		value = 200.25;
		formattedValue = numberFormatter.format(value);

		expect(formattedValue).toBe(expected);

		value = 200.34;
		formattedValue = numberFormatter.format(value);

		expect(formattedValue).toBe(expected);
	});

	test("numbers representing percentages are formatted correctly", () => {
		const expected = "12.3%";
		let value = 0.123;
		let formattedValue = ratioFormatter.format(value);

		expect(formattedValue).toBe(expected);

		value = 0.1234;
		formattedValue = ratioFormatter.format(value);

		expect(formattedValue).toBe(expected);

		value = 0.1229;
		formattedValue = ratioFormatter.format(value);

		expect(formattedValue).toBe(expected);
	});
});
