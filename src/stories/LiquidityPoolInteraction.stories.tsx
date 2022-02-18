import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { LiquidityPoolInteraction } from "@components/LiquidityPoolInteraction";

export default {
	title: "LiquidityPoolInteraction",
	component: LiquidityPoolInteraction,
} as ComponentMeta<typeof LiquidityPoolInteraction>;

const Template: ComponentStory<typeof LiquidityPoolInteraction> = (args) => (
	<div>
		<div className="flex">
			{/* TODO: change these to actual Tabs when that gets merged */}
			<div className="w-40 h-20 bg-neutral-0 grid place-items-center">Invest</div>
			<div className="w-40 h-20 bg-neutral-0 grid place-items-center">Withdraw</div>
		</div>
		<LiquidityPoolInteraction {...args} />
	</div>
);

export const Invest = Template.bind({});
Invest.args = {
	action: "invest",
	onSubmit: (values) => console.log(`investing ${values}`),
	onSubmitFailed: () => console.log(`investment failed`),
};

export const InvestMobile = Template.bind({});
InvestMobile.args = {
	action: "invest",
	onSubmit: (values) => console.log(`investing ${values}`),
	onSubmitFailed: () => console.log(`investment failed`),
};
InvestMobile.parameters = {
	viewport: {
		defaultViewport: "iphone12",
	},
};

export const InvestTablet = Template.bind({});
InvestTablet.args = {
	action: "invest",
	onSubmit: (values) => console.log(`investing ${values}`),
	onSubmitFailed: () => console.log(`investment failed`),
};
InvestTablet.parameters = {
	viewport: {
		defaultViewport: "ipad",
	},
};

export const Withdraw = Template.bind({});
Withdraw.args = {
	action: "withdraw",
	onSubmit: () => console.log("withdrawing"),
	onSubmitFailed: () => console.log("investing"),
};
