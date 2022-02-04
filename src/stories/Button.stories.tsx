import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Button } from "@components/Button";
import { Icon } from "@components/Icon";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	title: "Button",
	component: Button,
} as ComponentMeta<typeof Button>;

const defaultArgs = {
	children: "Button",
	size: "middle",
	disabled: false,
};
// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
	...defaultArgs,
	type: "primary",
};

export const PrimaryIcon = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
PrimaryIcon.args = {
	...defaultArgs,
	type: "primary",
	icon: <Icon name="bookmark" />,
};

export const Outline = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Outline.args = {
	...defaultArgs,
	type: "default",
};

export const OutlineIcon = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
OutlineIcon.args = {
	...defaultArgs,
	type: "default",
	icon: <Icon name="bookmark" />,
};
