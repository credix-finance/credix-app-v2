import React from "react";
import renderer from "react-test-renderer";
import { Input } from "@components/Input";
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
			<Input label={defaultArgs.label} placeholder={defaultArgs.placeholder} />
		</Form>
	);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});

test("Input with text", () => {
	const component = renderer.create(
		<Form layout="vertical">
			<Input
				label={defaultArgs.label}
				placeholder={defaultArgs.placeholder}
				value={defaultArgs.value}
			/>
		</Form>
	);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});

test("Input with error feedback", () => {
	const component = renderer.create(
		<Form layout="vertical">
			<Input
				label={defaultArgs.label}
				hasFeedback={true}
				validateStatus="error"
				placeholder={defaultArgs.placeholder}
				value={defaultArgs.value}
			/>
		</Form>
	);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});

test("Dispaly input", () => {
	const component = renderer.create(
		<Form layout="vertical">
			<Input
				label={defaultArgs.label}
				placeholder={defaultArgs.placeholder}
				value={defaultArgs.value}
				isDisplay={true}
			/>
		</Form>
	);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});

test("Disabled input", () => {
	const component = renderer.create(
		<Form layout="vertical">
			<Input
				label={defaultArgs.label}
				disabled={true}
				placeholder={defaultArgs.placeholder}
				value={defaultArgs.value}
			/>
		</Form>
	);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});

test("Input with description", () => {
	const component = renderer.create(
		<Form layout="vertical">
			<Input
				label={"This is a longer question with some more informations under it?"}
				description="This is a short information text that gives more details about the question."
				placeholder={defaultArgs.placeholder}
				value={defaultArgs.value}
			/>
		</Form>
	);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});
