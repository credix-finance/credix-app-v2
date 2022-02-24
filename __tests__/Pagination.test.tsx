import React from "react";
import renderer from "react-test-renderer";
import { Pagination } from "@components/Pagination";

test("Default", () => {
	const component = renderer.create(<Pagination pageSize={1} total={5} />);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});

test("With more", () => {
	const component = renderer.create(<Pagination pageSize={1} total={10} />);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});
