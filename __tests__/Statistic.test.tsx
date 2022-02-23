import React from "react";
import renderer from "react-test-renderer";
import { Statistic } from "@components/Statistic";
import Big from "big.js";
import { Ratio } from "@credix/credix-client";

test("Currency statistic", () => {
	const props = {
		label: "TVL",
		value: new Big(14_800_000_000_000),
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
		value: new Ratio(0.138, 1),
		isPercentage: true,
	};

	const component = renderer.create(<Statistic {...props} />);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});
