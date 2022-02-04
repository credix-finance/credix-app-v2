import React from "react";
import renderer from "react-test-renderer";
import { Icon } from "@components/Icon";

test("Bookmark icon", () => {
	const component = renderer.create(<Icon name="bookmark" />);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});

test("Wallet icon", () => {
	const component = renderer.create(<Icon name="wallet" />);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});
