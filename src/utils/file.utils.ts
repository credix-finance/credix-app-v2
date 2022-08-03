import { RcFile } from "antd/lib/upload";
import { parse } from "csv-parse/browser/esm/sync";

export const readFileAsText = (file: RcFile, callBack: (url: string) => void) => {
	const reader = new FileReader();

	reader.onload = (e) => {
		callBack(e.target.result as string);
	};

	return reader.readAsText(file);
};

/**
 * Generic function to parse and transform CSV data
 * @param input CSV string to be parsed
 * @param headers the list of expected headers
 * @param callBack method that will do transformations on the parsed data
 * @returns the parsed data
 */
export function parseCSV<T, R>(input: string, headers: string[], callBack: (data: T[]) => R) {
	let records: T[] = [];
	records = parse(input, {
		skip_empty_lines: true,
		trim: true,
		columns: true, // Parse the first line as the headers
	});

	try {
		return callBack(records);
	} catch {
		throw new Error(
			`Expected headers: ${headers.map((h) => `"${h}"`).join(", ")} to be present in that order`
		);
	}
}
