import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Stepper } from "@components/Stepper";

export default {
	title: "Components/Stepper",
	component: Stepper,
} as ComponentMeta<typeof Stepper>;

const Template: ComponentStory<typeof Stepper> = (args) => (
	<div>
		<Stepper {...args} />
		<div className="w-full h-[1px] mt-10 mb-8 bg-neutral-105"></div>
	</div>
);

const steps = ["Deal details", "Tranche structure", "Review"];

export const Default = Template.bind({});
Default.args = {
	current: 0,
	steps,
};

export const FinishedStep = Template.bind({});
FinishedStep.args = {
	current: 1,
	steps,
};
