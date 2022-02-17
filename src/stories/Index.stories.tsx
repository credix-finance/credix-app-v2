import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";

import Overview from "../pages/index";
import { MainMenu } from "@components/MainMenu";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	title: "Pages/Index",
	component: Overview,
	parameters: {
		layout: "fullscreen",
		//👇 The viewports object from the Essentials addon
		viewport: {
			//👇 The viewports you want to use
			viewports: INITIAL_VIEWPORTS,
			//👇 Your own default viewport
			defaultViewport: "default",
		},
	},
} as ComponentMeta<typeof Overview>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Overview> = (args) => (
	<div className="grid">
		<MainMenu />
		<Overview {...args} />
	</div>
);
export const Desktop = Template.bind({});
Desktop.args = {};
Desktop.parameters = {
	viewport: {
		defaultViewport: "default",
	},
};

export const Tablet = Template.bind({});
Tablet.args = {};
Tablet.parameters = {
	viewport: {
		defaultViewport: "ipad",
	},
};

export const Mobile = Template.bind({});
Mobile.args = {};
Mobile.parameters = {
	viewport: {
		defaultViewport: "iphone12",
	},
};
