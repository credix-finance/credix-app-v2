import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Checkbox } from "@components/Checkbox";
import Form from "antd/lib/form/Form";

export default {
	title: "Checkbox",
	component: Checkbox,
} as ComponentMeta<typeof Checkbox>;

const Template: ComponentStory<typeof Checkbox> = (args) => <Checkbox name="test" {...args} />;

const defaultArgs = {
	label: "Simple answer to select",
};

export const Default = Template.bind({});
Default.decorators = [
	(Story) => (
		<Form layout="vertical" className="w-[400px]">
			<Story />
		</Form>
	),
];
Default.args = {
	...defaultArgs,
};

export const Checked = Template.bind({});
Checked.decorators = [
	(Story) => (
		<Form layout="vertical" initialValues={{ test: true }} className="w-[400px]">
			<Story />
		</Form>
	),
];
Checked.args = {
	...defaultArgs,
};
