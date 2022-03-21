import React from "react";
import renderer from "react-test-renderer";
import { Icon, IconDimension, iconNames } from "@components/Icon";

iconNames.forEach((name) => {
	test(`Icons: ${name}`, () => {
		const component = renderer.create(<Icon size={IconDimension.SMALL} name={name} />);

		const tree = component.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
