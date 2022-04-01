import React from "react";
import renderer from "react-test-renderer";
import { Tag } from "@components/Tag";

test("Active tag", () => {
	const component = renderer.create(<Tag type="active">Active</Tag>);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});

test("Inactive tag", () => {
	const component = renderer.create(<Tag type="inactive">Inactive</Tag>);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});

test("Ended tag", () => {
	const component = renderer.create(<Tag type="ended">Ended</Tag>);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});

test("Pending tag", () => {
	const component = renderer.create(<Tag type="pending">Pending</Tag>);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});
