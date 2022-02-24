import React from "react";
import renderer from "react-test-renderer";
import { Table } from "@components/Table";

const defaultData = {
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
			dataIndex: "name",
			key: "name",
		},
		{
			title: "Amount",
			dataIndex: "amount",
			key: "amount",
			render: (text) => <span className="font-medium text-lg">{text}</span>,
		},
		{
			title: "Date",
			dataIndex: "date",
			key: "date",
			render: (text) => <span className="font-medium text-lg">{text}</span>,
		},
	],
};

test("Default", () => {
	const component = renderer.create(<Table {...defaultData} />);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});

test("Table headers with icons", () => {
	const columns = [
		{
			title: "Name",
			icon: "stacked-column-down",
			dataIndex: "name",
			key: "name",
		},
		{
			title: "Amount",
			icon: "stacked-column-down",
			dataIndex: "amount",
			key: "amount",
			render: (text) => <span className="font-medium text-lg">{text}</span>,
		},
		{
			title: "Date",
			icon: "calendar",
			dataIndex: "date",
			key: "date",
			render: (text) => <span className="font-medium text-lg">{text}</span>,
		},
	];

	const data = Object.assign({}, defaultData, { columns });

	const component = renderer.create(<Table {...data} />);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});
