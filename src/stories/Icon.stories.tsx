import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Icon } from "@components/Icon";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	title: "Components/Icon",
	component: Icon,
} as ComponentMeta<typeof Icon>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Icon> = (args) => <Icon {...args} />;

export const Bookmark = Template.bind({});
Bookmark.args = {
	name: "bookmark",
};

export const Wallet = Template.bind({});
Wallet.args = {
	name: "wallet",
};

export const ChevronLeftSquare = Template.bind({});
ChevronLeftSquare.args = {
	name: "chevron-left-square",
};

export const LineChart = Template.bind({});
LineChart.args = {
	name: "line-chart",
};

export const Coins = Template.bind({});
Coins.args = {
	name: "coins",
};

export const Timeline = Template.bind({});
Timeline.args = {
	name: "timeline",
};

export const Grid = Template.bind({});
Grid.args = {
	name: "grid",
};

export const User = Template.bind({});
User.args = {
	name: "user",
};
