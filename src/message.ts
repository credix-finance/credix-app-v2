import React from "react";
import { Icon } from "@components/Icon";
import { message as antdMessage } from "antd";

interface MessageProps {
	content: string;
	duration?: number;
}

const defaultClassName = "";

const success = (props: MessageProps) => {
	antdMessage.success({
		...props,
		className: defaultClassName,
		icon: React.createElement(Icon, { name: "check-circle" }),
	});
};

const error = (props: MessageProps) => {
	antdMessage.error({
		...props,
		className: defaultClassName,
		icon: React.createElement(Icon, { name: "exclamation-circle", className: "text-error" }),
	});
};

const message = {
	success,
	error,
};

export default message;
