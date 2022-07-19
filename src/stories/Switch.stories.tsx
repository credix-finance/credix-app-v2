import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Switch } from "@components/Switch";
import { Form } from "antd";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	title: "Switch",
	component: Switch,
} as ComponentMeta<typeof Switch>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Switch> = (args) => (
	<Form>
		<Switch {...args} />
	</Form>
);

export const Default = Template.bind({});
Default.args = {
	name: "switch",
	label: "Switch",
};
