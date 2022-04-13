import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Select } from "@components/Select";
import Form from "antd/lib/form/Form";

export default {
	title: "Select",
	component: Select,
} as ComponentMeta<typeof Select>;

const Template: ComponentStory<typeof Select> = (args) => (
	<Form layout="vertical" className="w-[400px]">
		<Select name="test" {...args} />
	</Form>
);

const defaultArgs = {
	hasFeedback: false,
	validateStatus: "",
	disabled: false,
	description: "",
	help: "",
	isDisplay: false,
	placeholder: "Select option",
	label: "Company Info",
	value: "Answer one",
	options: [
		{
			label: "this is the first option",
			value: "1",
		},
		{
			label: "this is the second option",
			value: "2",
		},
	],
};

export const Default = Template.bind({});
Default.args = {
	...defaultArgs,
	value: null,
};

export const Display = Template.bind({});
Display.args = {
	...defaultArgs,
	isDisplay: true,
};

export const WithError = Template.bind({});
WithError.args = {
	...defaultArgs,
	hasFeedback: true,
	validateStatus: "error",
};

export const Disabled = Template.bind({});
Disabled.args = {
	...defaultArgs,
	disabled: true,
	value:
		"This is information about our company. Also information about our team and history. This information can not be changed",
};

export const WithDescription = Template.bind({});
WithDescription.args = {
	...defaultArgs,
	description: "This is a short information text that gives more details about the question.",
};
