import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Icon } from "@components/Icon";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	title: "Icon",
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
