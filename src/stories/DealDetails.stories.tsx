import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { DealDetails } from "@components/DealDetails";
import { PublicKey } from "@solana/web3.js";
import Big from "big.js";
import { Ratio } from "@credix/credix-client";

export default {
	title: "Components/DealDetails",
	component: DealDetails,
} as ComponentMeta<typeof DealDetails>;

const Template: ComponentStory<typeof DealDetails> = (args) => <DealDetails {...args} />;

export const Default = Template.bind({});
Default.args = {
	deal: {
		borrower: new PublicKey("CRDx2YkdtYtGZXGHZ59wNv1EwKHQndnRc1gT4p8i2vPX"),
		principal: new Big(1_000_000_000_000),
		principalAmountRepaid: new Big(500_000_000_000),
		financingFeePercentage: new Ratio(1, 8),
		totalInterest: new Big(300_000_000_000),
		interestToRepay: new Big(200_000_000_000),
		interestRepaid: new Big(100_000_000_000),
		isInProgress: () => true,
		timeToMaturity: 360,
		daysRemaining: 300,
	},
};