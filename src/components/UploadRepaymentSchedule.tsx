import { DAYS_IN_REPAYMENT_PERIOD } from "@consts";
import { RepaymentSchedulePeriod } from "@credix_types/repaymentschedule.types";
import { readFileAsText } from "@utils/file.utils";
import { classNames } from "@utils/format.utils";
import { parseScheduleCSV } from "@utils/repayment.utils";
import { Form, Upload, UploadProps } from "antd";
import { FunctionComponent, useState } from "react";
import { defineMessages, useIntl } from "react-intl";
import { CustomRepaymentSchedule } from "./CustomRepaymentSchedule";
import { DealFormField } from "./DealForm";
import { FileDropZone } from "./FileDropZone";

export const UploadRepaymentSchedule: FunctionComponent<{ className?: string }> = ({
	className,
}) => {
	const intl = useIntl();
	const form = Form.useFormInstance();

	const selectedRepaymentSchedule = Form.useWatch(DealFormField.RepaymentType, form);
	const [fileName, setFileName] = useState<string | null>(null);
	const [customSchedule, setCustomSchedule] = useState<RepaymentSchedulePeriod[] | null>(null);

	const props: UploadProps = {
		name: "file",
		multiple: false,
		accept: ".csv",
		showUploadList: false,
		beforeUpload(file) {
			readFileAsText(file, (text) => {
				setFileName(file.name);
				const scheduleData = parseScheduleCSV(text);

				const timeToMaturity = scheduleData.length * DAYS_IN_REPAYMENT_PERIOD;
				form.setFieldsValue({
					principal: scheduleData[scheduleData.length - 1].cumulativePrincipal.toString(),
					[DealFormField.RepaymentType]: DealFormField.CustomRepaymentSchedule,
					// TODO: get this value from the client
					financingFee: "15",
					timeToMaturity: timeToMaturity.toString(),
					schedule: scheduleData,
				});
				setCustomSchedule(scheduleData);
			});
			return false;
		},
	};

	if (customSchedule) {
		return (
			<CustomRepaymentSchedule
				isInteractive={true}
				checked={selectedRepaymentSchedule === DealFormField.CustomRepaymentSchedule}
				subtitle={fileName}
				action={
					<Upload {...props}>
						<div className="font-mono text-base font-medium underline">
							{intl.formatMessage(MESSAGES.uploadAnotherFile)}
						</div>
					</Upload>
				}
			/>
		);
	}

	return (
		<div className={classNames([className])}>
			<FileDropZone title={intl.formatMessage(MESSAGES.uploadTitle)} {...props} />
		</div>
	);
};

const MESSAGES = defineMessages({
	uploadTitle: {
		defaultMessage: "For custom repayment structures, you can use our upload functionality.",
		description: "Custom repayment schedule: upload title",
	},
	uploadAnotherFile: {
		defaultMessage: "Upload another file",
		description: "Custom tranche: upload another file",
	},
});
