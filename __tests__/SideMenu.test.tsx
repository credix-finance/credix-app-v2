import React from "react";
import renderer from "react-test-renderer";
import { SideMenu } from "@components/SideMenu";
import { IconName } from "@components/Icon";

const items = [
	{
		icon: "line-chart" as IconName,
		label: "Invest",
		path: "/invest",
		isActive: true,
	},
	{
		icon: "coins" as IconName,
		label: "withdraw",
		path: "/withdraw",
		isActive: false,
	},
	{
		icon: "timeline" as IconName,
		label: "Deals",
		path: "/deals",
		isActive: false,
	},
	{
		icon: "grid" as IconName,
		label: "Transactions",
		path: "/transactions",
		isActive: false,
	},
	{
		icon: "user" as IconName,
		label: "Account",
		path: "/account",
		isActive: false,
	},
];

test("Side menu", () => {
	const component = renderer.create(<SideMenu menuItems={items} />);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});
