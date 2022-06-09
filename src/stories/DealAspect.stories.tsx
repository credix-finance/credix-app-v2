import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { DealAspect } from "@components/DealAspect";
import { Fraction } from "@credix/credix-client";

export default {
	title: "Components/DealAspect",
	component: DealAspect,
} as ComponentMeta<typeof DealAspect>;

const Template: ComponentStory<typeof DealAspect> = (args) => <DealAspect {...args} />;

export const Default = Template.bind({});
Default.args = {
	title: "Principal",
	value: "100M",
};

export const WithRatio = Template.bind({});
WithRatio.args = {
	title: "Principal repaid",
	value: "100K",
	ratio: new Fraction(0.15, 1),
};

export const WithRatioButNotShown = Template.bind({});
WithRatioButNotShown.args = {
	title: "Principal repaid",
	value: "100K",
	ratio: new Fraction(0.15, 1),
	showRatio: false,
};
