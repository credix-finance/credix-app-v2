import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Statistic } from "@components/Statistic";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	title: "Statistic",
	component: Statistic,
} as ComponentMeta<typeof Statistic>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Statistic> = (args) => <Statistic {...args} />;

export const Currency = Template.bind({});
Currency.args = {
	label: "TVL",
	value: 14800000,
	currency: "USDC",
	isPercentage: false,
};

export const Percentage = Template.bind({});
Percentage.args = {
	label: "Estimated APY",
	value: 0.138,
	isPercentage: true,
};
