import React from "react";
import renderer from "react-test-renderer";
import { Icon, iconNames } from "@components/Icon";

iconNames.forEach((name) => {
	test(`Icons: ${name}`, () => {
		const component = renderer.create(<Icon size="small" name={name} />);

		const tree = component.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
