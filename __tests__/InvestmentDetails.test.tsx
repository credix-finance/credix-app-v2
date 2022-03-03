import React from "react";
import renderer from "react-test-renderer";
import { InvestmentDetails } from "@components/InvestmentDetails";
import { TokenAmount } from "@solana/web3.js";
import Big from "big.js";

test("Positive return", () => {
	const props = {
		balance: {
			uiAmountString: "65",
		} as TokenAmount,
		balanceCurrency: "USDC",
		investments: new Big(256),
		investmentsCurrency: "USDC",
		investmentsReturn: 3.43,
	};

	const component = renderer.create(<InvestmentDetails {...props} />);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});

test("Negative return", () => {
	const props = {
		balance: {
			uiAmountString: "65",
		} as TokenAmount,
		balanceCurrency: "USDC",
		investments: new Big(256),
		investmentsCurrency: "USDC",
		investmentsReturn: -3.43,
	};

	const component = renderer.create(<InvestmentDetails {...props} />);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});
