import React from "react";
import "../src/styles/globals.css";
import "../src/styles/antd.less";
import * as NextImage from "next/image";
const theme = require("../theme");

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
	backgrounds: {
		default: "light",
		values: [
			{
				name: "light",
				value: theme.colors["light"],
			},
			{
				name: "dark",
				value: theme.colors["dark"],
			},
			{
				name: "dark 2",
				value: theme.colors["darker"],
			},
		],
	},
};

export const decorators = [
	(Story) => (
		<div className="font-mono">
			<Story />
		</div>
	),
];
