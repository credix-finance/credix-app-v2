import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { SideMenu } from "@components/SideMenu";

export default {
	title: "SideMenu",
	component: SideMenu,
	parameters: {
		layout: "fullscreen",
	},
} as ComponentMeta<typeof SideMenu>;

const Template: ComponentStory<typeof SideMenu> = (args) => <SideMenu {...args} />;

export const Default = Template.bind({});
Default.args = {
	menuItems: [
		{
			icon: "line-chart",
			label: "Invest",
			path: "/invest",
			isActive: true,
		},
		{
			icon: "coins",
			label: "withdraw",
			path: "/withdraw",
			isActive: false,
		},
		{
			icon: "timeline",
			label: "Deals",
			path: "/deals",
			isActive: false,
		},
		{
			icon: "grid",
			label: "Transactions",
			path: "/transactions",
			isActive: false,
		},
		{
			icon: "user",
			label: "Account",
			path: "/account",
			isActive: false,
		},
	],
};
