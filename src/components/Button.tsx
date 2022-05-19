import React from "react";
import { Button as AntdButton } from "antd";
import { ButtonProps as AntButtonProps } from "antd/lib/button";

interface ButtonProps {
	/**
	 * Controls whether the button is disabled or not.
	 */
	disabled?: AntButtonProps["disabled"];
	/**
	 * Optional icon that is renderd at the start of the button.
	 */
	icon?: AntButtonProps["icon"];
	/**
	 * Controls whether a loading spinner is displayed at the start of the button.
	 */
	loading?: AntButtonProps["loading"];
	/**
	 * Buttons with the block property will take up the entire width of their parent.
	 */
	block?: AntButtonProps["block"];
	onClick?: AntButtonProps["onClick"];
	className?: AntButtonProps["className"];
	children?: AntButtonProps["children"];
	/**
	 * The type of the button. Only "default" and "primary" are supported.
	 */
	type?: "default" | "primary";
	/**
	 * The html type of the button.
	 */
	htmlType?: AntButtonProps["htmlType"];
}

export const buttonTypeStyles = {
	primary: `
				bg-action-primary border-action-primary text-credix-primary
				hover:bg-neutral-60 hover:border-neutral-60
				active:bg-neutral-40 active:border-neutral-40 active:text-neutral-100
				disabled:bg-action-disable disabled:border-transparent disabled:text-disabled
			`,
	default: `
				bg-credix-primary text-neutral-100 border-neutral-100
				hover:text-neutral-60 hover:border-neutral-60
				active:text-neutral-40 active:border-neutral-60
				disabled:border-action-disable disabled:text-disabled
			`,
};

export const defaultButtonStyles =
	"rounded-md h-12 text-base font-medium border text-shadow-none shadow-none flex items-center justify-center gap-2 px-6";

export const Button = ({ children, className, type = "primary", ...props }: ButtonProps) => {
	className = [defaultButtonStyles, buttonTypeStyles[type], className].filter(Boolean).join(" ");

	return (
		<AntdButton className={className} type={type} {...props}>
			{children}
		</AntdButton>
	);
};
