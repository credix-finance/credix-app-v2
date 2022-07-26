import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { MainMenu } from "@components/MainMenu";
import { ClientProvider } from "@components/ClientProvider";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	title: "MainMenu",
	component: MainMenu,
	parameters: {
		layout: "fullscreen",
	},
} as ComponentMeta<typeof MainMenu>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof MainMenu> = (args) => <MainMenu {...args} />;
export const Default = Template.bind({});
Default.args = {};
