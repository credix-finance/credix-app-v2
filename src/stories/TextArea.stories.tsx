import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { TextArea } from "@components/TextArea";
import Form from "antd/lib/form/Form";

export default {
	title: "TextArea",
	component: TextArea,
} as ComponentMeta<typeof TextArea>;

const Template: ComponentStory<typeof TextArea> = (args) => (
	<Form layout="vertical" className="w-[400px]">
		<TextArea {...args} />
	</Form>
);

const defaultArgs = {
	hasFeedback: false,
	validateStatus: "",
	disabled: false,
	description: "",
	help: "",
	isDisplay: false,
	placeholder: "Write information here",
	label: "Company Info",
	value:
		"This is information about our company. Also information about our team and history. This information can be changed if needed",
};

export const Default = Template.bind({});
Default.args = {
	...defaultArgs,
	value: null,
};

export const WithText = Template.bind({});
WithText.args = {
	...defaultArgs,
};

export const Display = Template.bind({});
Display.args = {
	...defaultArgs,
	isDisplay: true,
	value:
		"This is information about our company. Also information about our team and history. This information can not be changed",
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
