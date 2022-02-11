import React, { useContext } from "react";
import { Input as AntdInput } from "antd";
import { InputProps as AntInputProps } from "antd/lib/input";
import { InputContext } from "./Label";

interface InputProps {
	/**
	 * Controls wheter the input can be interacted with or not.
	 * This differs from setting `disabled` to `true` in that by
	 * setting this option to true will remove any styling from the
	 * input that makes it look like an input.
	 */
	isDisplay?: boolean;
	placeholder?: AntInputProps["placeholder"];
	onClick?: AntInputProps["onClick"];
	className?: AntInputProps["className"];
	children?: AntInputProps["children"];
	value?: AntInputProps["value"];
}

export const Input = ({
	children,
	value,
	className = "",
	isDisplay = false,
	...props
}: InputProps) => {
	const { hasFeedback, validateStatus, disabled } = useContext(InputContext);

	if (isDisplay) {
		return <div className="font-medium text-base pt-2 pb-4">{value}</div>;
	}

	return (
		<AntdInput
			disabled={disabled}
			value={value}
			className={`
				pl-4 pr-[25px] py-3 font-medium text-base bg-credix-primary placeholder-neutral-100/70 border-[0.5px] rounded-[1px]
				focus:shadow-none
				disabled:border-neutral-60/40
				${
					hasFeedback && validateStatus == "error"
						? "border-error focus:ring-error focus:border-error"
						: "border-neutral-60 focus:ring-neutral-100 focus:border-neutral-100 "
				}
				${className}
			`}
			{...props}
		>
			{children}
		</AntdInput>
	);
};
