import { validateMaxValue, validateMinValue, validatePublicKey } from "@utils/validation.utils";

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

describe("validatePublicKey", () => {
	test("it rejects promise when value is not a valid public key", async () => {
		const value = "00000000";
		const validationMessage = "error public key";

		await expect(validatePublicKey(value, validationMessage)).rejects.toEqual(validationMessage);
	});

	test("it resolves promise when value is a valid public key", async () => {
		const value = "Ej5zJzej7rrUoDngsJ3jcpfuvfVyWpcDcK7uv9cE2LdL";
		const validationMessage = "error public key";

		await expect(validatePublicKey(value, validationMessage)).resolves.toBe(undefined);
	});

	test("it resolves promise when no value is given", async () => {
		const value = null;
		const validationMessage = "error public key";

		await expect(validatePublicKey(value, validationMessage)).resolves.toBe(undefined);
	});
});
