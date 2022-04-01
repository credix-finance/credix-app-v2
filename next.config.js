const withLess = require("next-with-less");
const theme = require("./theme");

module.exports = withLess({
	// Less config
	lessLoaderOptions: {
		lessOptions: theme.lessOptions,
	},
	// NextJS config
	/**
	 * At the time of this writing AntdDesign does not support React 18 and StrictMode.
	 * This causes the form validation to break and crash the application.
	 * See: https://github.com/ant-design/ant-design/issues/26136 for more information.
	 * We disable strict mode for now and will monitor the issue.
	 * Bart De Caluwe - 29/03/2022
	 */
	reactStrictMode: false,
	basePath: process.env.NEXT_PUBLIC_BASE_PATH,
	assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH,
});
