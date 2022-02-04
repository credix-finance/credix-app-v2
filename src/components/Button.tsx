import React from "react";
import { Button as AntdButton } from "antd";
import { ButtonProps as AntdButtonProps } from "antd/lib/button";

interface ButtonProps extends AntdButtonProps {
	type?: "primary" | "default";
	size?: "small" | "middle" | "large";
}

const buttonTypeStyles = {
	primary: `
				bg-action-primary border-action-primary text-credix-primary
				hover:bg-neutral-60 hover:border-neutral-60
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

const buttonSizeStyles = {
	small: "text-sm font-semibold h-10",
	middle: "text-base font-medium h-[42px]",
	large: "text-lg font-semibold h-[50px]",
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
			className={`rounded-[1px] text-shadow-none shadow-none flex items-center gap-2 px-[25px] ${buttonTypeStyles[type]} ${buttonSizeStyles[size]} ${className}`}
			size={size}
			type={type}
			{...props}
		>
			{children}
		</AntdButton>
	);
};
