const path = require("path");
const theme = require("../theme");

module.exports = {
	stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
	staticDirs: ["../public"],
	addons: [
		"@storybook/addon-links",
		"@storybook/addon-essentials",
		{
			/**
			 * NOTE: fix Storybook issue with PostCSS@8
			 * @see https://github.com/storybookjs/storybook/issues/12668#issuecomment-773958085
			 */
			name: "@storybook/addon-postcss",
			options: {
				postcssLoaderOptions: {
					implementation: require("postcss"),
				},
			},
		},
	],
	core: {
		builder: "webpack5",
	},
	webpackFinal: (config) => {
		/**
		 * Add support for alias-imports
		 * @see https://github.com/storybookjs/storybook/issues/11989#issuecomment-715524391
		 */
		config.resolve.alias = {
			...config.resolve?.alias,
			"@components": path.resolve(__dirname, "../src/components"),
			"@credix_types": path.resolve(__dirname, "../src/types"),
			"@consts": path.resolve(__dirname, "../src/consts"),
			"@config": path.resolve(__dirname, "../src/config"),
			"@message": path.resolve(__dirname, "../src/message"),
			"@notification": path.resolve(__dirname, "../src/notification"),
			"@state": path.resolve(__dirname, "../src/state"),
			"@utils": path.resolve(__dirname, "../src/utils"),
			"@hooks": path.resolve(__dirname, "../src/hooks"),
			"@": [path.resolve(__dirname, "../src/"), path.resolve(__dirname, "../")],
		};

		/**
		 * Fixes font import with /
		 * @see https://github.com/storybookjs/storybook/issues/12844#issuecomment-867544160
		 */
		config.resolve.roots = [path.resolve(__dirname, "../public"), "node_modules"];

		// Less
		config.module.rules.push({
			test: /\.less$/,
			include: [path.resolve(__dirname, "../src/styles")],
			use: [
				"style-loader",
				"css-loader",
				{
					loader: "less-loader",
					options: {
						lessOptions: theme.lessOptions,
					},
				},
			],
		});

		return config;
	},
};
