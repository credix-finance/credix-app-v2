import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Drawer, DrawerProps } from "@components/Drawer";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	title: "Drawer",
	component: Drawer,
} as ComponentMeta<typeof Drawer>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Drawer> = (args) => <Drawer {...args} />;

export const Default = Template.bind({});
Default.args = {
	title: "Drawer",
	titleIcon: "bookmark",
	children: <div>Drawer content yeah</div>,
	visible: true,
	onClose: () => null,
	onCancel: () => null,
	onSave: () => null,
} as DrawerProps;
