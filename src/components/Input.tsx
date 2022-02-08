import React from "react";
import { Input as AntdInput } from "antd";
import { InputProps as AntInputProps } from "antd/lib/input";
import { FormItemProps } from "antd/lib/form";

interface InputProps {
	/**
	 * Optional size of the input.
	 */
	size?: AntInputProps["size"];
	/**
	 * Controls whether the input is disabled or not.
	 */
	disabled?: AntInputProps["disabled"];
	/**
	 * Controls wheter the input can be interacted with or not.
	 * This differs from setting `disabled` to `true` in that by
	 * setting this option to true will remove any styling from the
	 * input that makes it look like an input.
	 */
	isDisplay?: boolean;
	placeholder: AntInputProps["placeholder"];
	onClick?: AntInputProps["onClick"];
	className?: AntInputProps["className"];
	children?: AntInputProps["children"];
	value?: AntInputProps["value"];
	hasFeedback?: FormItemProps["hasFeedback"];
	validateStatus?: "error" | "";
}

const inputSizeStyles = {
	small: "text-sm font-semibold h-10",
	middle: "text-base font-medium h-[42px]",
	large: "text-lg font-semibold h-[50px]",
};

export const Input = ({
	children,
	value,
	hasFeedback = false,
	validateStatus = null,
	className = "",
	disabled = false,
	isDisplay = false,
	size = "middle",
	...props
}: InputProps) => {
	if (isDisplay) {
		return <div className="font-medium text-base pt-2 pb-4">{value}</div>;
	}

	return (
		<AntdInput
			size={size}
			disabled={disabled}
			value={value}
			suffix={null}
			className={`
				font-medium text-base bg-credix-primary
				placeholder-neutral-100/70
				border-[0.5px] rounded-[1px]
				focus:shadow-none
				disabled:border-neutral-60/40
				${
					hasFeedback && validateStatus == "error"
						? "border-error focus:ring-error focus:border-error"
						: "border-neutral-60 focus:ring-neutral-100 focus:border-neutral-100 "
				}
				${inputSizeStyles[size]}
				${className}
			`}
			{...props}
		>
			{children}
		</AntdInput>
	);
};
