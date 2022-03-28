import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { InvestmentDetails } from "@components/InvestmentDetails";
import Big from "big.js";
import { TokenAmount } from "@solana/web3.js";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	title: "InvestmentDetails",
	component: InvestmentDetails,
} as ComponentMeta<typeof InvestmentDetails>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof InvestmentDetails> = (args) => (
	<InvestmentDetails {...args} />
);

export const Positive = Template.bind({});
Positive.args = {
	balance: {
		uiAmount: 65,
		uiAmountString: "65",
	} as TokenAmount,
	balanceCurrency: "USDC",
	investments: new Big(256),
	investmentsCurrency: "USDC",
	investmentsReturn: 3.34,
};

export const Negative = Template.bind({});
Negative.args = {
	balance: {
		uiAmount: 65,
		uiAmountString: "65",
	} as TokenAmount,
	balanceCurrency: "USDC",
	investments: new Big(256),
	investmentsCurrency: "USDC",
	investmentsReturn: -3.34,
};
