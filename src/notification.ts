import { ProgramError } from "types/program.types";
import { Icon, IconDimension } from "@components/Icon";
import { parseError } from "@utils/error.utils";
import { notification as antNotification } from "antd";
import { ArgsProps } from "antd/lib/notification";
import React from "react";

interface NotificationProps {
	message: ArgsProps["message"];
	description?: ArgsProps["description"];
}

interface ErrorNotificationProps extends NotificationProps {
	error?: Error | ProgramError;
}

const success = ({ message, description }: NotificationProps) => {
	antNotification.success({
		icon: React.createElement(Icon, {
			name: "check-circle",
			size: IconDimension.LARGE,
			className: "text-action-hover",
		}),
		message,
		description,
	});
};

const error = ({ message, error }: ErrorNotificationProps) => {
	const parsedError = parseError(error);

	antNotification.error({
		icon: React.createElement(Icon, {
			name: "exclamation-circle",
			size: IconDimension.LARGE,
			className: "text-error",
		}),
		message,
		description: parsedError,
		duration: 0,
	});
};

const notification = {
	success,
	error,
};

export default notification;
