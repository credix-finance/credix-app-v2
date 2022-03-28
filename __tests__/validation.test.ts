import { validateMaxValue, validateMinValue } from "@utils/validation.utils";

describe("validateMaxValue", () => {
	test("it rejects promise when value is greater than max value", async () => {
		const value = "200";
		const max = 100;
		const validationMessage = "error max value";

		await expect(validateMaxValue(value, max, validationMessage)).rejects.toEqual(
			validationMessage
		);
	});

	test("it resolves promise when value is less than max value", async () => {
		const value = "40";
		const max = 100;
		const validationMessage = "error max value";

		await expect(validateMaxValue(value, max, validationMessage)).resolves.toBe(undefined);
	});

	test("it resolves promise when value is equal to max value", async () => {
		const value = "100";
		const max = 100;
		const validationMessage = "error max value";

		await expect(validateMaxValue(value, max, validationMessage)).resolves.toBe(undefined);
	});
});

describe("validateMinValue", () => {
	test("it rejects promise when value is less than min value", async () => {
		const value = "40";
		const min = 100;
		const validationMessage = "error min value";

		await expect(validateMinValue(value, min, validationMessage)).rejects.toEqual(
			validationMessage
		);
	});

	test("it resolves promise when value is more than min value", async () => {
		const value = "40";
		const min = 0;
		const validationMessage = "error min value";

		await expect(validateMinValue(value, min, validationMessage)).resolves.toBe(undefined);
	});

	test("it resolves promise when value is equal to max value", async () => {
		const value = "0";
		const min = 0;
		const validationMessage = "error min value";

		await expect(validateMinValue(value, min, validationMessage)).resolves.toBe(undefined);
	});
});
