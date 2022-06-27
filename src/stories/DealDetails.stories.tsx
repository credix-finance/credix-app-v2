import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { DealDetails } from "@components/DealDetails";
import { PublicKey } from "@solana/web3.js";
import { Fraction } from "@credix/credix-client";

export default {
	title: "DealDetails",
	component: DealDetails,
} as ComponentMeta<typeof DealDetails>;

const Template: ComponentStory<typeof DealDetails> = (args) => <DealDetails {...args} />;

export const Default = Template.bind({});
Default.args = {
	deal: {
		borrower: new PublicKey("CRDx2YkdtYtGZXGHZ59wNv1EwKHQndnRc1gT4p8i2vPX"),
		financingFeePercentage: new Fraction(1, 8),
		isInProgress: () => true,
		timeToMaturity: 360,
		daysRemaining: 300,
		goLiveAt: new Date().getTime() / 1000,
		tranches: {
			tranches: [
				{
					principalRepaid: {
						uiAmount: 100_000,
					},
					interestRepaid: {
						uiAmount: 100_000,
					},
				},
			],
		},
		repaymentSchedule: {
			periods: [
				{
					interestRepaid: {
						uiAmount: 50_000_000,
					},
					principalRepaid: {
						uiAmount: 50_000_000,
					},
				},
			],
			totalInterest: {
				uiAmount: 100_000_000,
			},
			totalPrincipal: {
				uiAmount: 1_000_000,
			},
			duration: 360,
		},
	},
};
