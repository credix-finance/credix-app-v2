import React from "react";
import { Icon, IconName } from "@components/Icon";
import { message as antdMessage } from "antd";

interface MessageProps {
	content: string;
	duration?: number;
}

const defaultClassName = "";

const loading = (props: MessageProps) => {
	return antdMessage.loading({ ...props, className: defaultClassName });
};

const success = (props: MessageProps) => {
	antdMessage.success({
		...props,
		className: defaultClassName,
		icon: React.createElement(Icon, { name: "check-circle" as IconName, size: "small" }),
	});
};

const error = (props: MessageProps) => {
	antdMessage.error({
		...props,
		className: defaultClassName,
		icon: React.createElement(Icon, {
			name: "exclamation-circle" as IconName,
			size: "small",
			className: "text-error",
		}),
	});
};

const message = {
	success,
	error,
	loading,
};

export default message;
