import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Tag } from "@components/Tag";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	title: "Tag",
	component: Tag,
} as ComponentMeta<typeof Tag>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Tag> = (args) => <Tag {...args} />;

export const Green = Template.bind({});
Green.args = {
	children: "Active",
	color: "green",
};

export const Orange = Template.bind({});
Orange.args = {
	children: "Ended",
	color: "orange",
};

export const Yellow = Template.bind({});
Yellow.args = {
	children: "Open for funding",
	color: "yellow",
};

export const LightGray = Template.bind({});
LightGray.args = {
	children: "Principal withdrawal",
	color: "lightGray",
};

export const MidGray = Template.bind({});
MidGray.args = {
	children: "Interest withdrawal",
	color: "midGray",
};
