import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Button } from "@components/Button";
import { Icon, IconDimension } from "@components/Icon";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	title: "Components/Button",
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
	icon: <Icon name="bookmark" size={IconDimension.SMALL} />,
};

export const PrimaryDisabled = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
PrimaryDisabled.args = {
	...defaultArgs,
	type: "primary",
	disabled: true,
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
	icon: <Icon name="bookmark" size={IconDimension.SMALL} />,
};

export const OutlineDisabled = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
OutlineDisabled.args = {
	...defaultArgs,
	type: "default",
	disabled: true,
};
