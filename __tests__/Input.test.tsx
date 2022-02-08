import React from "react";
import "./__mocks__/matchMedia.mock";
import renderer from "react-test-renderer";
import { Input } from "@components/Input";
import { Label } from "@components/Label";
import { Form } from "antd";

const defaultArgs = {
	size: "middle",
	label: "Borrower Key",
	placeholder: "key",
	disabled: false,
	isDisplay: false,
	value: "USBDCKTVGBBK",
};

test("Default input", () => {
	const component = renderer.create(
		<Form layout="vertical">
			<Label value={defaultArgs.label}>
				<Input placeholder={defaultArgs.placeholder} />
			</Label>
		</Form>
	);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});

test("Input with text", () => {
	const component = renderer.create(
		<Form layout="vertical">
			<Label value={defaultArgs.label}>
				<Input placeholder={defaultArgs.placeholder} value={defaultArgs.value} />
			</Label>
		</Form>
	);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});

test("Input with error feedback", () => {
	const component = renderer.create(
		<Form layout="vertical">
			<Label value={defaultArgs.label} hasFeedback={true} validateStatus="error">
				<Input
					placeholder={defaultArgs.placeholder}
					value={defaultArgs.value}
					hasFeedback={true}
					validateStatus="error"
				/>
			</Label>
		</Form>
	);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});

test("Dispaly input", () => {
	const component = renderer.create(
		<Form layout="vertical">
			<Label value={defaultArgs.label}>
				<Input placeholder={defaultArgs.placeholder} value={defaultArgs.value} isDisplay={true} />
			</Label>
		</Form>
	);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});

test("Disabled input", () => {
	const component = renderer.create(
		<Form layout="vertical">
			<Label value={defaultArgs.label}>
				<Input placeholder={defaultArgs.placeholder} value={defaultArgs.value} disabled={true} />
			</Label>
		</Form>
	);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});

test("Input with description", () => {
	const component = renderer.create(
		<Form layout="vertical">
			<Label
				value={"This is a longer question with some more informations under it?"}
				description="This is a short information text that gives more details about the question."
			>
				<Input placeholder={defaultArgs.placeholder} value={defaultArgs.value} disabled={true} />
			</Label>
		</Form>
	);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});
