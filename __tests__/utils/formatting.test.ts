import Big from "big.js";
import {
	formatDate,
	formatTimestamp,
	round,
	clamp,
	compactFormatter,
	ratioFormatter,
	classNames,
	daysToMilliseconds,
	millisecondsToDays,
	isBig,
	isTokenAmount,
} from "@utils/format.utils";
import { zeroTokenAmount } from "@consts";

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
		let formattedValue = compactFormatter.format(value);

		expect(formattedValue).toBe(expected);

		value = 200.25;
		formattedValue = compactFormatter.format(value);

		expect(formattedValue).toBe(expected);

		value = 200.34;
		formattedValue = compactFormatter.format(value);

		expect(formattedValue).toBe(expected);
	});

	test("numbers are formatted compactly", () => {
		const expected = "100K";
		const value = 100_000;
		const formattedValue = compactFormatter.format(value);

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

describe("classnames", () => {
	it("joins an array of strings separated by a space", () => {
		const input = ["a", "b", "c"];
		const expected = "a b c";

		expect(classNames(input)).toEqual(expected);
	});

	it("filters out false values", () => {
		const input = ["a", "b", "c", false && "d"];
		const expected = "a b c";

		expect(classNames(input)).toEqual(expected);
	});

	it("filters out null values", () => {
		const input = ["a", "b", "c", null && "d"];
		const expected = "a b c";

		expect(classNames(input)).toEqual(expected);
	});
});

describe("daysToMilliseconds", () => {
	it("returns the given amount of days in milliseconds", () => {
		const input = 30;
		const expected = 2_592_000_000;

		expect(daysToMilliseconds(input)).toEqual(expected);
	});
});

describe("millisecondsToDays", () => {
	it.only("returns the given amount of milliseconds in days", () => {
		const input = 2_592_000_000;
		const expected = 30;

		expect(millisecondsToDays(input)).toEqual(expected);
	});
});

describe("isBig", () => {
	it("returns true for a Big number", () => {
		const input = new Big(100);
		const expected = true;

		expect(isBig(input)).toEqual(expected);
	});

	it("returns false for a TokenAmount", () => {
		const input = zeroTokenAmount;
		const expected = false;

		expect(isBig(input)).toEqual(expected);
	});
});

describe("isTokenAmount", () => {
	it("returns true for a TokenAmount", () => {
		const input = zeroTokenAmount;
		const expected = true;

		expect(isTokenAmount(input)).toEqual(expected);
	});

	it("returns false for a Big number", () => {
		const input = new Big(100);
		const expected = false;

		expect(isTokenAmount(input)).toEqual(expected);
	});
});
