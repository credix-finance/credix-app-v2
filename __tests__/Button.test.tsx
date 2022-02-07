import React from "react";
import renderer from "react-test-renderer";
import { Button } from "@components/Button";
import { Icon } from "@components/Icon";

test("Primary button", () => {
	const component = renderer.create(<Button type="primary">Button</Button>);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});

test("Primary button with icon", () => {
	const icon = <Icon name="bookmark" />;
	const component = renderer.create(
		<Button type="primary" icon={icon}>
			Button
		</Button>
	);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});

test("Primary button disabled", () => {
	const component = renderer.create(
		<Button type="primary" disabled={true}>
			Button
		</Button>
	);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});

test("Outline button", () => {
	const component = renderer.create(<Button type="default">Button</Button>);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});

test("Outline button with icon", () => {
	const icon = <Icon name="bookmark" />;
	const component = renderer.create(
		<Button type="default" icon={icon}>
			Button
		</Button>
	);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});

test("Outline button disabled", () => {
	const component = renderer.create(
		<Button type="default" disabled={true}>
			Button
		</Button>
	);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});
