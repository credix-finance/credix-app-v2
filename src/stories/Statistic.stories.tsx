import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Statistic } from "@components/Statistic";
import Big from "big.js";
import { Ratio } from "@credix/credix-client";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	title: "Components/Statistic",
	component: Statistic,
} as ComponentMeta<typeof Statistic>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Statistic> = (args) => (
	<div className="w-max">
		<Statistic {...args} />
	</div>
);
export const Currency = Template.bind({});
Currency.args = {
	label: "TVL",
	value: new Big(14_800_000_000_000),
	currency: "USDC",
	isPercentage: false,
};

export const Percentage = Template.bind({});
Percentage.args = {
	label: "Estimated APY",
	value: new Ratio(0.138, 1),
	isPercentage: true,
};
