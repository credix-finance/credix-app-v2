import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Form from "antd/lib/form/Form";
import { BooleanChoice } from "@components/BooleanChoice";

export default {
	title: "Boolean choice",
	component: BooleanChoice,
} as ComponentMeta<typeof BooleanChoice>;

const Template: ComponentStory<typeof BooleanChoice> = (args) => (
	<BooleanChoice {...args} name="test" />
);

const defaultArgs = {
	hasFeedback: false,
	validateStatus: "",
	description: "",
	help: "",
	label: "Simple question with yes or no",
	value: true,
};

export const Default = Template.bind({});
Default.decorators = [
	(Story) => (
		<Form layout="vertical" className="w-[560px]" initialValues={{ test: true }}>
			<Story />
		</Form>
	),
];
Default.args = {
	...defaultArgs,
	value: true,
};

export const WithError = Template.bind({});
WithError.decorators = [
	(Story) => (
		<Form layout="vertical" className="w-[560px]" initialValues={{ test: null }}>
			<Story />
		</Form>
	),
];
WithError.args = {
	...defaultArgs,
	value: null,
	hasFeedback: true,
	validateStatus: "error",
	help: "required!",
};

export const WithDescription = Template.bind({});
WithDescription.decorators = [
	(Story) => (
		<Form layout="vertical" className="w-[560px]" initialValues={{ test: true }}>
			<Story />
		</Form>
	),
];
WithDescription.args = {
	...defaultArgs,
	description: "This is a short information text that gives more details about the question.",
};
