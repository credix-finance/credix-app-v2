import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Pagination } from "@components/Pagination";

export default {
	title: "Pagination",
	component: Pagination,
} as ComponentMeta<typeof Pagination>;

const Template: ComponentStory<typeof Pagination> = (args) => <Pagination {...args} />;

export const Default = Template.bind({});
Default.args = {
	pageSize: 1,
	total: 5,
};

export const WithMore = Template.bind({});
WithMore.args = {
	pageSize: 1,
	total: 10,
};
