import React from "react";
import renderer from "react-test-renderer";
import { SideMenu } from "@components/SideMenu";
import { SideMenuItemProps } from "@components/SideMenuItem";
import { IconNames } from "@components/Icon";

const items = [
	{
		icon: "line-chart" as IconNames,
		label: "Invest",
		path: "/invest",
		isActive: true,
	},
	{
		icon: "coins" as IconNames,
		label: "withdraw",
		path: "/withdraw",
		isActive: false,
	},
	{
		icon: "timeline" as IconNames,
		label: "Deals",
		path: "/deals",
		isActive: false,
	},
	{
		icon: "grid" as IconNames,
		label: "Transactions",
		path: "/transactions",
		isActive: false,
	},
	{
		icon: "user" as IconNames,
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
