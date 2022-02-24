import React from "react";
import renderer from "react-test-renderer";
import { Tabs } from "@components/Tabs";
import { TabPane } from "@components/TabPane";

test("Default", () => {
	const component = renderer.create(
		<Tabs>
			<TabPane tab="tab 1" key="1">
				This is the content of tab 1
			</TabPane>
			<TabPane tab="tab 2" key="2">
				This is the content of tab 2
			</TabPane>
		</Tabs>
	);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});
