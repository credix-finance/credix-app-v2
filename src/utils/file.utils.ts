import { RcFile } from "antd/lib/upload";

export const readFileAsText = (file: RcFile, callBack: (url: string) => void) => {
	const reader = new FileReader();

	reader.onload = (e) => {
		callBack(e.target.result as string);
	};

	return reader.readAsText(file);
};
