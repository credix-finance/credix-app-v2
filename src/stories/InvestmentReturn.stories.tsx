import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { InvestmentReturn } from "@components/InvestmentReturn";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	title: "InvestmentReturn",
	component: InvestmentReturn,
} as ComponentMeta<typeof InvestmentReturn>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof InvestmentReturn> = (args) => <InvestmentReturn {...args} />;

export const Positive = Template.bind({});
Positive.args = {
	value: 2.48,
};

export const Negative = Template.bind({});
Negative.args = {
	value: -2.48,
};
