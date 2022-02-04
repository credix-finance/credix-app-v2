import React from "react";
import renderer from "react-test-renderer";
import { Button } from "@components/Button";

test("Primary button", () => {
	const component = renderer.create(<Button type="primary">Button</Button>);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});
