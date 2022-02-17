import React from "react";
import renderer from "react-test-renderer";
import { InvestmentDetails } from "@components/InvestmentDetails";

test("Default", () => {
	const props = {
		balance: 65,
		balance_currency: "USDC",
		investments: 256,
		investments_currency: "USDC",
	};

	const component = renderer.create(<InvestmentDetails {...props} />);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});
