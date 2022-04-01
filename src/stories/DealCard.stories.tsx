import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { DealCard } from "@components/DealCard";

export default {
	title: "DealCard",
	component: DealCard,
} as ComponentMeta<typeof DealCard>;

const Template: ComponentStory<typeof DealCard> = (args) => <DealCard {...args} />;

export const Default = Template.bind({});
Default.args = {
	marketplace: "credix-marketplace",
	deal: { name: "this is the name" },
	children: <div>This is the child</div>,
};

export const WithLongName = Template.bind({});
WithLongName.args = {
	marketplace: "credix-marketplace",
	deal: { name: "this is the nameeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee soooo very long" },
	children: <div>This is the child</div>,
};
