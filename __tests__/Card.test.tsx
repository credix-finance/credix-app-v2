import React from "react";
import renderer from "react-test-renderer";
import { Card } from "@components/Card";

const cardContent = "This is the content of the card.";

test("Card with small offset", () => {
	const component = renderer.create(
		<Card topTitle="top title" title="title" offset="small">
			{cardContent}
		</Card>
	);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});

test("Card with middle offset", () => {
	const component = renderer.create(
		<Card topTitle="top title" title="title" offset="middle">
			{cardContent}
		</Card>
	);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});

test("Card with large offset", () => {
	const component = renderer.create(
		<Card topTitle="top title" title="title" offset="large">
			{cardContent}
		</Card>
	);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});
