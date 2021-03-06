import React from "react";
import { Input as AntdInput, Form } from "antd";
import { InputProps as AntInputProps } from "antd/lib/input";
import { FormItemProps } from "antd/lib/form";

interface InputProps {
	/**
	 * Label text
	 */
	label: FormItemProps["label"];
	/**
	 * Name text
	 */
	name?: FormItemProps["name"];
	/**
	 * Optional description to provide more information about the input
	 */
	description?: string;
	/**
	 * Specifis whether the input has validation feedback
	 */
	hasFeedback?: FormItemProps["hasFeedback"];
	/**
	 * The prompt message. If not provided, the prompt message will be generated by the validation rule.
	 */
	help?: FormItemProps["help"];
	/**
	 * The result of the validation rules
	 */
	validateStatus?: "error" | "";
	/**
	 * Controls wheter the input can be interacted with or not.
	 * This differs from setting `disabled` to `true` in that by
	 * setting this option to true will remove any styling from the
	 * input that makes it look like an input.
	 */
	isDisplay?: boolean;
	placeholder?: AntInputProps["placeholder"];
	onClick?: AntInputProps["onClick"];
	type?: AntInputProps["type"];
	addonBefore?: AntInputProps["addonBefore"];
	suffix?: AntInputProps["suffix"];
	className?: AntInputProps["className"];
	labelClassName?: AntInputProps["className"];
	children?: AntInputProps["children"];
	value?: AntInputProps["value"];
	rules?: FormItemProps["rules"];
	disabled?: boolean;
	required?: boolean;
	/**
	 * Specifies the increment step for number inputs
	 */
	step?: string;
	/**
	 * Specifies the locale used for the input wich affects the decimal seperator
	 */
	lang?: string;
}

export const Input = ({
	label,
	name,
	description,
	children,
	value,
	hasFeedback,
	validateStatus,
	help,
	rules,
	className,
	labelClassName,
	isDisplay = false,
	disabled = false,
	required = false,
	...props
}: InputProps) => {
	if (isDisplay) {
		return (
			<Form.Item label={label} className="font-bold text-base">
				<div className="font-medium text-base pt-2 pb-4">{value}</div>
			</Form.Item>
		);
	}

	const inputClassName = [
		"border-[0.5px] rounded-[1px] h-12 focus:shadow-none disabled:border-neutral-60/40",
		hasFeedback && validateStatus == "error"
			? "border-error focus:ring-error focus:border-error"
			: "border-neutral-60 focus:ring-neutral-100 focus:border-neutral-100",
		className,
	]
		.filter(Boolean)
		.join(" ");

	labelClassName = [
		"font-bold text-base",
		disabled && "text-neutral-60/40",
		hasFeedback && validateStatus === "error" && "border-error",
		!labelClassName?.includes("mb-") && "mb-7",
		labelClassName,
	]
		.filter(Boolean)
		.join(" ");

	return (
		<Form.Item
			label={label}
			help={help}
			hasFeedback={hasFeedback}
			validateStatus={validateStatus}
			required={required}
			className={labelClassName}
		>
			<Form.Item name={name} className="mb-0" rules={rules}>
				<AntdInput
					disabled={disabled}
					value={value}
					size="large"
					className={inputClassName}
					{...props}
				>
					{children}
				</AntdInput>
			</Form.Item>
			{description && <div className="font-normal text-sm mt-2">{description}</div>}
		</Form.Item>
	);
};
