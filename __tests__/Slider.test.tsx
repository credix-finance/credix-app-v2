import React from "react";
import renderer from "react-test-renderer";
import { Slider } from "@components/Slider";

test("Default slider", () => {
	const component = renderer.create(<Slider value={50} />);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});

test("Full slider", () => {
	const component = renderer.create(<Slider value={50} />);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});
