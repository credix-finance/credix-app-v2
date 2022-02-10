import React from "react";
import renderer from "react-test-renderer";
import { MainMenu } from "@components/MainMenu";

test("Main menu", () => {
	const component = renderer.create(<MainMenu />);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});
