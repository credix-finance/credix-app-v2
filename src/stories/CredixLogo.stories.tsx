import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { CredixLogo, CredixLogoType } from "@components/CredixLogo";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	title: "Components/CredixLogo",
	component: CredixLogo,
} as ComponentMeta<typeof CredixLogo>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CredixLogo> = (args) => <CredixLogo {...args} />;

export const Light = Template.bind({});
Light.args = {
	mode: CredixLogoType.LIGHT,
	className: "w-12 h-12",
};
Light.parameters = {
	backgrounds: { default: "dark" },
};

export const Dark = Template.bind({});
Dark.args = {
	mode: CredixLogoType.DARK,
	className: "w-12 h-12",
};
Dark.parameters = {
	backgrounds: { default: "light" },
};
