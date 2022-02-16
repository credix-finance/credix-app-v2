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

test("Chevron icon", () => {
	const component = renderer.create(<Icon name="chevron-left-square" />);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});

test("Line chart icon", () => {
	const component = renderer.create(<Icon name="line-chart" />);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});

test("Coins icon", () => {
	const component = renderer.create(<Icon name="coins" />);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});

test("Timeline icon", () => {
	const component = renderer.create(<Icon name="timeline" />);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});

test("Grid icon", () => {
	const component = renderer.create(<Icon name="grid" />);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});

test("User icon", () => {
	const component = renderer.create(<Icon name="user" />);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});
