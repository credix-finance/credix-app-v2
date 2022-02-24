import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { WalletButton } from "@components/WalletButton";

export default {
	title: "Components/WalletButton",
	component: WalletButton,
} as ComponentMeta<typeof WalletButton>;

const Template: ComponentStory<typeof WalletButton> = (args) => <WalletButton {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
