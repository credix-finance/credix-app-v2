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

export const Default = Template.bind({});
Default.args = {
	children: "Active",
	type: "active",
};

export const Pending = Template.bind({});
Pending.args = {
	children: "Pending",
	type: "pending",
};

export const Inactive = Template.bind({});
Inactive.args = {
	children: "Inactive",
	type: "inactive",
};

export const Ended = Template.bind({});
Ended.args = {
	children: "Ended",
	type: "ended",
};
