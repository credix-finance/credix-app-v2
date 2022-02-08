import React from "react";
import renderer from "react-test-renderer";
import { render } from "@testing-library/react";
import { Slider } from "@components/Slider";

test("Default slider", () => {
	const component = renderer.create(<Slider value={50} />);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});

test("Full slider", () => {
	const component = renderer.create(<Slider value={100} />);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});

test("Overfull slider without fullLabel", () => {
	const component = renderer.create(<Slider value={200} />);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});

test("Full slider displays full label", () => {
	const fullLabel = "Fully repaid";
	const component = render(<Slider value={100} fullLabel={fullLabel} />);
	component.getByText(fullLabel);
});
