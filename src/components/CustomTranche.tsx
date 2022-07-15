import { DefaultTranche } from "@consts";
import { readFileAsText } from "@utils/file.utils";
import { parseTrancheCSV } from "@utils/tranche.utils";
import { Form, Upload, UploadProps } from "antd";
import { useState } from "react";
import { defineMessages, useIntl } from "react-intl";
import { DealFormField } from "./DealForm";
import { FileDropZone } from "./FileDropZone";
import { TrancheSelectionOption } from "./TrancheSelectionOption";

export const CustomTranche = () => {
	const intl = useIntl();
	const form = Form.useFormInstance();

	const selectedTranche = Form.useWatch(DealFormField.TrancheStructure, form);
	const [fileName, setFileName] = useState<string | null>(null);
	const [customTranche, setCustomTranche] = useState<DefaultTranche | null>(null);

	const props: UploadProps = {
		name: "file",
		multiple: false,
		accept: ".csv",
		showUploadList: false,
		beforeUpload(file) {
			readFileAsText(file, (text) => {
				setFileName(file.name);
				const trancheStructure = parseTrancheCSV(text);
				const mapped = trancheStructure.trancheData.reduce((obj, tranche) => {
					obj[tranche.name] = {
						earlyWithdrawalInterest: tranche.earlyWithdrawalInterest,
						earlyWithdrawalPrincipal: tranche.earlyWithdrawalPrincipal,
						percentageOfPrincipal: tranche.percentageOfPrincipal?.toString(),
						percentageOfInterest: tranche.percentageOfInterest?.toString(),
						apr: tranche.apr?.toString(),
					};
					return obj;
				}, {});
				setCustomTranche(trancheStructure);
				form.resetFields([DealFormField.CustomTranche]);
				form.setFieldsValue({
					trancheStructure: DealFormField.CustomTranche,
					customTranche: mapped,
				});
			});
			return false;
		},
	};

	if (customTranche) {
		return (
			<div>
				<TrancheSelectionOption
					key={customTranche.title}
					tranche={customTranche}
					editable={true}
					form={form}
					checked={selectedTranche === customTranche.value}
					subtitle={fileName}
					action={
						<Upload {...props}>
							<div className="font-mono text-base font-medium underline">
								{intl.formatMessage(MESSAGES.uploadAnotherFile)}
							</div>
						</Upload>
					}
				/>
			</div>
		);
	}

	return <FileDropZone title={intl.formatMessage(MESSAGES.uploadTitle)} {...props} />;
};

const MESSAGES = defineMessages({
	uploadTitle: {
		defaultMessage: "For custom tranche structures, you can use our upload functionality.",
		description: "Custom tranche: upload title",
	},
	uploadAnotherFile: {
		defaultMessage: "Upload another file",
		description: "Custom tranche: upload another file",
	},
});
