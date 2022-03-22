import React from "react";
import renderer from "react-test-renderer";
import { InvestmentDetails } from "@components/InvestmentDetails";

test("Positive return", () => {
	const props = {
		balance: 65,
		balanceCurrency: "USDC",
		investments: 256,
		investmentsCurrency: "USDC",
		investmentsReturn: 3.43,
	};

	const component = renderer.create(<InvestmentDetails {...props} />);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});

test("Negative return", () => {
	const props = {
		balance: 65,
		balanceCurrency: "USDC",
		investments: 256,
		investmentsCurrency: "USDC",
		investmentsReturn: -3.43,
	};

	const component = renderer.create(<InvestmentDetails {...props} />);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});
