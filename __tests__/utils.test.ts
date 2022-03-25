import { formatDate, formatTimestamp } from "@utils/format.utils";

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
