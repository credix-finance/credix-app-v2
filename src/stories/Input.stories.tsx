import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Label } from "@components/Label";
import { Input } from "@components/Input";
import { Form } from "antd";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	title: "Input",
	component: Label,
	subcomponents: { Input },
	decorators: [
		(Story) => (
			<Form layout="vertical">
				<Story />
			</Form>
		),
	],
} as ComponentMeta<typeof Label>;

const defaultArgs = {
	label: "Borrower Key",
	hasFeedback: false,
	validateStatus: "",
	disabled: false,
	description: "",
	help: "",
	placeholder: "key",
	isDisplay: false,
	value: "USBDCKTVGBBK",
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<any> = ({
	disabled,
	value,
	hasFeedback,
	validateStatus,
	description,
	help,
	placeholder,
	isDisplay,
	label,
}) => (
	<Label
		label={label}
		description={description}
		help={help}
		disabled={disabled}
		hasFeedback={hasFeedback}
		validateStatus={validateStatus}
	>
		<Input value={value} placeholder={placeholder} isDisplay={isDisplay} />
	</Label>
);

export const Default = Template.bind({});
Default.args = {
	...defaultArgs,
	value: "",
};

export const WithText = Template.bind({});
WithText.args = {
	...defaultArgs,
};

export const WithError = Template.bind({});
WithError.args = {
	...defaultArgs,
	hasFeedback: true,
	validateStatus: "error",
};

export const Display = Template.bind({});
Display.args = {
	...defaultArgs,
	isDisplay: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
	...defaultArgs,
	disabled: true,
};

export const WithDescription = Template.bind({});
WithDescription.args = {
	...defaultArgs,
	label: "This is a longer question with some more informations under it?",
	description: "This is a short information text that gives more details about the question.",
};
