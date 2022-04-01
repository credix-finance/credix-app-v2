import React from "react";
import renderer from "react-test-renderer";
import { CredixLogo } from "@components/CredixLogo";

test("Light logo", () => {
	const component = renderer.create(<CredixLogo mode="light" />);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});

test("Dark logo", () => {
	const component = renderer.create(<CredixLogo mode="dark" />);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});
