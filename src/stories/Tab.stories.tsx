import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Tabs } from "@components/Tabs";
import { TabPane } from "@components/TabPane";

export default {
	title: "Tabs",
	component: Tabs,
} as ComponentMeta<typeof Tabs>;

const Template: ComponentStory<typeof Tabs> = (args) => <Tabs {...args} />;

export const Default = Template.bind({});
Default.args = {
	children: (
		<>
			<TabPane tab="Investments" key="1">
				Tab one content
			</TabPane>
			<TabPane tab="Investments" key="2">
				Tab two content
			</TabPane>
		</>
	),
};
