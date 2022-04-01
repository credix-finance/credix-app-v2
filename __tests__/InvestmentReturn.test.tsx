import React from "react";
import renderer from "react-test-renderer";
import { InvestmentReturn } from "@components/InvestmentReturn";

test("Positive return", () => {
	const props = { value: 2.45 };

	const component = renderer.create(<InvestmentReturn {...props} />);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});

test("Negative return", () => {
	const props = {
		value: -2.45,
	};

	const component = renderer.create(<InvestmentReturn {...props} />);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});
