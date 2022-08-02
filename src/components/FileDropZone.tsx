import { FunctionComponent } from "react";
import type { UploadProps } from "antd";
import { Upload } from "antd";
import { Icon, IconDimension } from "./Icon";
import { defineMessages } from "@formatjs/intl";
import { useIntl } from "react-intl";

const { Dragger } = Upload;

interface FileDropZoneProps extends Partial<UploadProps> {
	title: string;
}

export const FileDropZone: FunctionComponent<FileDropZoneProps> = ({ title, ...props }) => {
	const intl = useIntl();

	return (
		<div>
			<div className="font-normal text-sm mb-6">{title}</div>
			<Dragger {...props}>
				<div className="flex font-medium text-base space-x-4">
					<Icon name="file" size={IconDimension.MIDDLE} />
					<div>{intl.formatMessage(MESSAGES.upload)}</div>
					<div className="underline">{intl.formatMessage(MESSAGES.selectAFile)}</div>
				</div>
				<div className="text-disabled text-left mt-4 font-medium text-sm">
					{intl.formatMessage(MESSAGES.supportedFileTypes, { types: props.accept })}
				</div>
			</Dragger>
		</div>
	);
};

const MESSAGES = defineMessages({
	upload: {
		defaultMessage: "Drop your file here or",
		description: "File Drop zone: drop file",
	},
	selectAFile: {
		defaultMessage: "Select a file",
		description: "File Drop zone: select file",
	},
	supportedFileTypes: {
		defaultMessage: "Filetypes supported: {types}",
		description: "File Drop zone: supported file types",
	},
});
