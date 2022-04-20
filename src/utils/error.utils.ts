import { ProgramError } from "types/program.types";

export const parseError = (error: Error | ProgramError) => {
	if (!error) {
		return null;
	}

	if (error instanceof Error) {
		return error.toString();
	}

	return parseProgramError(error);
};

const parseProgramError = (error: ProgramError) => {
	return error.msg;
};
