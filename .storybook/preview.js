import React from "react";
import "../src/styles/globals.css";
import "../src/styles/antd.less";
import * as NextImage from "next/image";

const OriginalNextImage = NextImage.default;

Object.defineProperty(NextImage, "default", {
	configurable: true,
	value: (props) => <OriginalNextImage {...props} unoptimized />,
});

export const parameters = {
	actions: { argTypesRegex: "^on[A-Z].*" },
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
	previewTabs: {
		"storybook/docs/panel": { index: -1 },
	},
};

export const decorators = [
	(Story) => (
		<div className="font-mono">
			<Story />
		</div>
	),
];
