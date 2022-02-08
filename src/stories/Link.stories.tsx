import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Link } from "@components/Link";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	title: "Link",
	component: Link,
} as ComponentMeta<typeof Link>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Link> = (args) => <Link {...args} />;

export const Default = Template.bind({});
Default.args = {
	to: "/",
	label: "Load More",
};

export const WithIcon = Template.bind({});
WithIcon.args = {
	to: "/",
	label: "Go Back",
	icon: "chevron-left-square",
};
