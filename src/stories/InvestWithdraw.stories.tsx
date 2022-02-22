import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";

import { InvestWithdraw } from "@components/InvestWithdraw";

export default {
	title: "InvestWithdraw",
	component: InvestWithdraw,
	parameters: {
		//👇 The viewports object from the Essentials addon
		viewport: {
			//👇 The viewports you want to use
			viewports: INITIAL_VIEWPORTS,
			//👇 Your own default viewport
			defaultViewport: "default",
		},
	},
} as ComponentMeta<typeof InvestWithdraw>;

const Template: ComponentStory<typeof InvestWithdraw> = (args) => <InvestWithdraw {...args} />;

export const Desktop = Template.bind({});
Desktop.args = {};

export const Mobile = Template.bind({});
Mobile.args = {};
Mobile.parameters = {
	viewport: {
		defaultViewport: "iphone12",
	},
};

export const Tablet = Template.bind({});
Tablet.args = {};
Tablet.parameters = {
	viewport: {
		defaultViewport: "ipad",
	},
};
