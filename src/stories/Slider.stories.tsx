import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Slider } from "@components/Slider";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	title: "Slider",
	component: Slider,
} as ComponentMeta<typeof Slider>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Slider> = (args) => <Slider {...args} />;

export const Default = Template.bind({});
Default.args = {
	value: 50,
};

export const Full = Template.bind({});
Full.args = {
	value: 100,
	fullLabel: "Fully repaid",
};
