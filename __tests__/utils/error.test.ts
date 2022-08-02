import { parseError } from "@utils/error.utils";
import { ProgramError } from "./../../src/types/program.types";

describe("error parsing", () => {
	it("should parse program errors", () => {
		const error: ProgramError = {
			code: 1,
			msg: "Something wrong",
		};

		expect(parseError(error)).toEqual(error.msg);
	});

	it("should parse typescript errors", () => {
		const errorMessage = "Something wrong";
		const error = new Error(errorMessage);

		expect(parseError(error)).toEqual(errorMessage);
	});
});
