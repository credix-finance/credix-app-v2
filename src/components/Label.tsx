import React, { createContext } from "react";
import { Form } from "antd";
import { FormItemProps } from "antd/lib/form";

export type InputContextType = {
	hasFeedback: FormItemProps["hasFeedback"];
	validateStatus: "error" | "";
};

export const InputContext = createContext<InputContextType>({
	hasFeedback: false,
	validateStatus: "error",
});

interface LabelProps {
	children?: FormItemProps["children"];
	disabled?: boolean;
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
	 * Label text
	 */
	value: FormItemProps["label"];
	/**
	 * The result of the validation rules
	 */
	validateStatus?: "error" | "";
}

export const Label = ({
	value,
	hasFeedback,
	validateStatus,
	children,
	description,
	disabled = false,
	...props
}: LabelProps) => {
	return (
		<Form.Item
			label={value}
			hasFeedback={hasFeedback}
			validateStatus={validateStatus}
			className={`
				font-bold text-base
				${disabled && "text-neutral-60/40"}
				${hasFeedback && validateStatus === "error" && "border-error"}
			`}
			{...props}
		>
			{description && <div className="font-normal text-sm mt-0 mb-[10px]">{description}</div>}
			<InputContext.Provider value={{ hasFeedback, validateStatus }}>
				{children}
			</InputContext.Provider>
		</Form.Item>
	);
};
