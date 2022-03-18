import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Layout from "@components/Layout";

export default {
	title: "Components/Layout",
	parameters: {
		layout: "fullscreen",
	},
} as ComponentMeta<never>;

const Template: ComponentStory<never> = () => (
	<div className="px-28 py-11">This is the content of the page</div>
);

export const MainMenu = Template.bind({});
MainMenu.decorators = [
	(Story) => (
		<Layout.WithMainMenu>
			<Story />
		</Layout.WithMainMenu>
	),
];
MainMenu.args = {};

export const SideMenu = Template.bind({});
SideMenu.decorators = [
	(Story) => (
		<Layout.WithSideMenu>
			<Story />
		</Layout.WithSideMenu>
	),
];
SideMenu.args = {};

export const SideAndMainMenu = Template.bind({});
SideAndMainMenu.decorators = [
	(Story) => (
		<Layout.WithSideMenu>
			<Layout.WithMainMenu showLogo={false}>
				<Story />
			</Layout.WithMainMenu>
		</Layout.WithSideMenu>
	),
];
SideAndMainMenu.args = {};
