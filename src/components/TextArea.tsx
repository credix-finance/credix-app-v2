import React, { FunctionComponent } from "react";
import { TextAreaProps as AntTextAreaProps } from "antd/lib/input";
import { Input } from "antd";
import { FormItem } from "@components/FormItem";
import { FormItemProps } from "antd/lib/form";
import { classNames } from "@utils/format.utils";

const { TextArea: AntTextArea } = Input;
const DEFAULT_TEXTAREA_ROWS = 6;

interface TextAreaProps {
	rows?: AntTextAreaProps["rows"];
	placeholder?: AntTextAreaProps["placeholder"];
	value?: AntTextAreaProps["value"];
	className?: AntTextAreaProps["className"];
	label: string;
	/**
	 * Controls wheter the input can be interacted with or not.
	 * This differs from setting `disabled` to `true` in that by
	 * setting this option to true will remove any styling from the
	 * input that makes it look like an input.
	 */
	isDisplay?: boolean;
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
	disabled?: boolean;
	required?: boolean;
	/**
	 * Optional description to provide more information about the input
	 */
	description?: string;
	/**
	 * Form item name
	 */
	name?: FormItemProps["name"];
}

export const TextArea: FunctionComponent<TextAreaProps> = ({
	rows = DEFAULT_TEXTAREA_ROWS,
	placeholder,
	className,
	label,
	isDisplay,
	value,
	hasFeedback,
	validateStatus,
	disabled,
	description,
	name,
	help,
}) => {
	className = classNames([
		"bg-neutral-0 border px-4 py-2 text-sm font-medium placeholder-neutral-100/70 focus:shadow-none",
		"disabled:border-neutral-60/40 disabled:text-darker/40 disabled:placeholder:text-darker/40",
		hasFeedback && validateStatus == "error"
			? "border-error focus:ring-error focus:border-error"
			: "border-neutral-60 focus:ring-neutral-100 focus:border-neutral-100",
		className,
	]);

	return (
		<FormItem
			isDisplay={isDisplay}
			label={label}
			value={value}
			hasFeedback={hasFeedback}
			validateStatus={validateStatus}
			disabled={disabled}
			description={description}
			name={name}
			help={help}
		>
			<AntTextArea
				rows={rows}
				placeholder={placeholder}
				className={className}
				disabled={disabled}
				value={value}
			/>
		</FormItem>
	);
};
