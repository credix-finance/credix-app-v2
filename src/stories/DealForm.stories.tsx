import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import DealForm from "@components/DealForm";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	title: "Components/DealForm",
	component: DealForm,
} as ComponentMeta<typeof DealForm>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof DealForm> = (args) => {
	return (
		<div className="bg-neutral-0 py-10 px-24 space-y-7">
			<DealForm {...args} />
		</div>
	);
};

export const Default = Template.bind({});
Default.args = {
	onSubmit: () => {
		return;
	},
};
