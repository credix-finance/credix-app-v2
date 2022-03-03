import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Button } from "@components/Button";
import message from "../message";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	title: "Components/Message",
} as ComponentMeta<typeof any>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof any> = ({ buttonText, ...args }) => (
	<Button {...args}>{buttonText}</Button>
);

export const Success = Template.bind({});
Success.args = {
	onClick: () => message.success({ content: "Wallet connected" }),
	buttonText: "Success",
};

export const Error = Template.bind({});
Error.args = {
	onClick: () => message.error({ content: "Wallet not connected" }),
	buttonText: "Error",
};

export const Loading = Template.bind({});
Loading.args = {
	onClick: () => message.loading({ content: "Connecting wallet" }),
	buttonText: "Loading",
};

export const LoadingThenSuccess = Template.bind({});
LoadingThenSuccess.args = {
	onClick: () => {
		const loadingMessage = message.loading({ content: "loading", duration: 0 });
		setTimeout(() => {
			loadingMessage();
			message.error({ content: "Wallet not connected" });
		}, 5000);
	},
	buttonText: "Loading then success",
};
