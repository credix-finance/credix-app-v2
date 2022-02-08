import { Link } from "@components/Link";
import React from "react";
import renderer from "react-test-renderer";

test("Default link", () => {
	const component = renderer.create(<Link to="/" />);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});

test("Link with icon", () => {
	const component = renderer.create(<Link to="/" icon="chevron-left-square" />);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});
