import React from "react";
import { Icon, IconDimension, IconName } from "@components/Icon";
import { message as antdMessage } from "antd";

interface MessageProps {
	content: string;
	duration?: number;
}

/**
 * Ensure that all message related DOM elements are removed when the component is dismissed.
 * Not destroying the message would cause the message background to remain visible.
 */
const defaultOnClose = () => antdMessage.destroy();

const loading = (props: MessageProps) => {
	antdMessage.loading({
		duration: 0,
		onClose: defaultOnClose,
		...props,
	});

	return defaultOnClose;
};

const success = (props: MessageProps) => {
	antdMessage.success({
		duration: 1,
		onClose: defaultOnClose,
		icon: React.createElement(Icon, {
			name: "check-circle" as IconName,
			size: IconDimension.SMALL,
		}),
		...props,
	});
};

const error = (props: MessageProps) => {
	antdMessage.error({
		onClose: defaultOnClose,
		icon: React.createElement(Icon, {
			name: "exclamation-circle" as IconName,
			size: IconDimension.SMALL,
			className: "text-error",
		}),
		...props,
	});
};

const message = {
	success,
	error,
	loading,
};

export default message;
