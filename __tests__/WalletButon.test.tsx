import React from "react";
import renderer from "react-test-renderer";
import { WalletButton } from "@components/WalletButton";

test("Wallet button", () => {
	const component = renderer.create(<WalletButton />);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});
