import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Table } from "@components/Table";
import { Tabs } from "@components/Tabs";
import { TabPane } from "@components/TabPane";
import { IconName } from "@components/Icon";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	title: "Table",
	component: Table,
} as ComponentMeta<typeof Table>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Table> = (args) => <Table {...args} />;

const defaultArgs = {
	dataSource: [
		{
			key: 0,
			name: "a55 Debenture Series-1",
			amount: "0.22 USDC",
			date: "02.11.21",
		},
		{
			key: 1,
			name: "a55 Debenture Series-1",
			amount: "0.22 USDC",
			date: "02.11.21",
		},
		{
			key: 2,
			name: "a55 Debenture Series-1",
			amount: "0.22 USDC",
			date: "02.11.21",
		},
		{
			key: 3,
			name: "a55 Debenture Series-1",
			amount: "0.22 USDC",
			date: "02.11.21",
		},
		{
			key: 4,
			name: "a55 Debenture Series-1",
			amount: "0.22 USDC",
			date: "02.11.21",
		},
	],
	columns: [
		{
			title: "Name",
			icon: "stacked-column-down" as IconName,
			dataIndex: "name",
			key: "name",
		},
		{
			title: "Amount",
			icon: "coins-alt" as IconName,
			dataIndex: "amount",
			key: "amount",
			render: (text) => <span className="font-medium text-lg">{text}</span>,
		},
		{
			title: "Date",
			icon: "calendar" as IconName,
			dataIndex: "date",
			key: "date",
			render: (text) => <span className="font-medium text-lg">{text}</span>,
		},
	],
};

export const Default = Template.bind({});
Default.args = defaultArgs;

export const WithPagination = Template.bind({});
WithPagination.args = {
	...defaultArgs,
	dataSource: [
		{
			key: 0,
			name: "a55 Debenture Series-1",
			amount: "0.22 USDC",
			date: "02.11.21",
		},
		{
			key: 1,
			name: "a55 Debenture Series-1",
			amount: "0.22 USDC",
			date: "02.11.21",
		},
		{
			key: 2,
			name: "a55 Debenture Series-1",
			amount: "0.22 USDC",
			date: "02.11.21",
		},
		{
			key: 3,
			name: "a55 Debenture Series-1",
			amount: "0.22 USDC",
			date: "02.11.21",
		},
		{
			key: 4,
			name: "a55 Debenture Series-1",
			amount: "0.22 USDC",
			date: "02.11.21",
		},
		{
			key: 5,
			name: "a55 Debenture Series-1",
			amount: "0.22 USDC",
			date: "02.11.21",
		},
		{
			key: 6,
			name: "a55 Debenture Series-1",
			amount: "0.22 USDC",
			date: "02.11.21",
		},
		{
			key: 7,
			name: "a55 Debenture Series-1",
			amount: "0.22 USDC",
			date: "02.11.21",
		},
		{
			key: 8,
			name: "a55 Debenture Series-1",
			amount: "0.22 USDC",
			date: "02.11.21",
		},
		{
			key: 9,
			name: "a55 Debenture Series-1",
			amount: "0.22 USDC",
			date: "02.11.21",
		},
		{
			key: 10,
			name: "Page two Series-1",
			amount: "0.22 USDC",
			date: "02.11.21",
		},
	],
};

export const WithTabs = Template.bind({});
WithTabs.decorators = [
	(Story) => (
		<Tabs tabBarExtraContent={undefined}>
			<TabPane tab="Investments 1" key="1">
				<Story />
			</TabPane>
			<TabPane tab="Investments 2" key="2">
				<Table dataSource={[]} columns={defaultArgs.columns} />
			</TabPane>
		</Tabs>
	),
];
WithTabs.args = defaultArgs;

export const Empty = Template.bind({});
Empty.args = {
	dataSource: [],
	columns: [],
};
