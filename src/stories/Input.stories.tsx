import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Label } from "@components/Label";
import { Input } from "@components/Input";
import { Form } from "antd";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	title: "Input",
	component: Input,
	decorators: [
		(Story) => (
			<Form layout="vertical">
				<Story />
			</Form>
		),
	],
} as ComponentMeta<typeof Input>;

const defaultDecorators = (Story) => (
	<Label value={defaultArgs.label} description={defaultArgs.description}>
		<Story />
	</Label>
);
const defaultArgs = {
	label: "Borrower Key",
	description: "",
	placeholder: "key",
	isDisplay: false,
	value: "USBDCKTVGBBK",
};
// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Input> = (args) => <Input {...args} />;

export const Default = Template.bind({});
Default.decorators = [defaultDecorators];
Default.args = {
	...defaultArgs,
	value: "",
};

export const WithText = Template.bind({});
WithText.decorators = [defaultDecorators];
WithText.args = {
	...defaultArgs,
};

export const WithError = Template.bind({});
WithError.decorators = [
	(Story) => (
		<Label value={defaultArgs.label} hasFeedback={true} validateStatus="error">
			<Story />
		</Label>
	),
];
WithError.args = {
	...defaultArgs,
};

export const Display = Template.bind({});
Display.decorators = [defaultDecorators];
Display.args = {
	...defaultArgs,
	isDisplay: true,
};

export const Disabled = Template.bind({});
Disabled.decorators = [
	(Story) => (
		<Label value={defaultArgs.label} disabled={true}>
			<Story />
		</Label>
	),
];
Disabled.args = {
	...defaultArgs,
};

export const WithDescription = Template.bind({});
WithDescription.decorators = [
	(Story) => (
		<Label
			value={"This is a longer question with some more informations under it?"}
			description={"This is a short information text that gives more details about the question."}
		>
			<Story />
		</Label>
	),
];
WithDescription.args = {
	...defaultArgs,
};
