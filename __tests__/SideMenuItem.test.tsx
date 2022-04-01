import React from "react";
import renderer from "react-test-renderer";
import { IconName } from "@components/Icon";
import { SideMenuItem } from "@components/SideMenuItem";

const defaultProps = {
	icon: "line-chart" as IconName,
	label: "Invest",
	path: "/invest",
	isActive: false,
};

test("Side menu item active", () => {
	const activeProps = {
		...defaultProps,
		isActive: true,
	};

	const component = renderer.create(<SideMenuItem {...activeProps} />);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});

test("Side menu item inactive", () => {
	const component = renderer.create(<SideMenuItem {...defaultProps} />);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});
