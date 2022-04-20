import { Icon, IconDimension } from '@components/Icon'
import { notification as antNotification } from 'antd';
import { ArgsProps } from "antd/lib/notification";
import React from 'react'

interface NotificationProps {
	message: ArgsProps["message"];
	description?: ArgsProps["description"];
}

const success = ({message, description}: NotificationProps) => {
	antNotification.success({
    message,
    description
  });
};

const error = ({message, description}: NotificationProps) => {
	antNotification.error({
		icon: React.createElement(Icon, {
			name: "exclamation-circle",
			size: IconDimension.LARGE,
			className: "text-error",
		}),
    message,
		description,
		duration: 0
  });
};

const notification = {
	success,
	error,
};

export default notification;
