import React from "react";
import { Button as AntdButton } from "antd";
import { ButtonProps as AntdButtonProps } from "antd/lib/button";

interface ButtonProps extends AntdButtonProps {
	type?: "primary" | "default";
	size?: "small" | "middle" | "large";
}

const buttonTypeStyles = {
	primary: `
				hover:bg-neutral-60 hover:border-neutral-60 hover:text-credix-primary
				active:bg-neutral-40 active:border-neutral-40 active:text-neutral-100
				disabled:bg-action-disable disabled:border-transparent disabled:text-disabled
			`,
	default: `
				bg-primary text-neutral-100 border-neutral-100
				hover:text-neutral-60 hover:border-neutral-60
				active:text-neutral-40 active:border-neutral-60
				disabled:border-action-disable disabled:text-disabled
			`,
};

const buttonTextStyles = {
	small: "text-sm font-semibold",
	middle: "text-base font-medium",
	large: "text-lg font-semibold",
};

export const Button = ({
	children,
	className = "",
	size = "middle",
	type = "primary",
	...props
}: ButtonProps) => {
	return (
		<AntdButton
			className={`rounded-[1px] text-shadow-none flex items-center gap-2 ${buttonTypeStyles[type]} ${buttonTextStyles[size]} ${className}`}
			size={size}
			type={type}
			{...props}
		>
			{children}
		</AntdButton>
	);
};
