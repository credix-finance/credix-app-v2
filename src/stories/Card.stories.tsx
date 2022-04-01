import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Card } from "@components/Card";
import { Button } from "@components/Button";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	title: "Components/Card",
	component: Card,
} as ComponentMeta<typeof Card>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Card> = (args) => (
	<div className="max-w-lg m-8">
		<Card {...args} />
	</div>
);

export const Default = Template.bind({});
Default.args = {
	topTitle: "step one",
	title: "Connect your wallet",
	offset: "middle",
};

export const WithContent = Template.bind({});
WithContent.args = {
	topTitle: "step one",
	title: "Connect your wallet",
	offset: "middle",
	children: (
		<div>
			This is the content of the card. The first step you have to do is to connect your wallet.
			After that, you can do all sorts of wonderful things.
		</div>
	),
};

export const WithButton = Template.bind({});
WithButton.args = {
	topTitle: "step one",
	title: "Connect your wallet",
	offset: "middle",
	children: (
		<div>
			<div className="mb-8">
				This is the content of the card. The first step you have to do is to connect your wallet.
				After that, you can do all sorts of wonderful things.
			</div>
			<Button>Connect your wallet</Button>
		</div>
	),
};
