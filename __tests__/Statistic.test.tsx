import React from "react";
import renderer from "react-test-renderer";
import { Statistic } from "@components/Statistic";

test("Currency statistic", () => {
	const props = {
		label: "TVL",
		value: 14800000,
		currency: "USDC",
		isPercentage: false,
	};

	const component = renderer.create(<Statistic {...props} />);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});

test("Percentage statistic", () => {
	const props = {
		label: "Estimated APY",
		value: 0.138,
		isPercentage: true,
	};

	const component = renderer.create(<Statistic {...props} />);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});
