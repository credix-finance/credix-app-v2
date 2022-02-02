const withLess = require("next-with-less");

module.exports = withLess({
	// Less config
	lessLoaderOptions: {
		lessOptions: {
			modifyVars: {},
			javascriptEnabled: true,
		},
	},
	// NextJS config
	reactStrictMode: true,
	basePath: process.env.NEXT_PUBLIC_BASE_PATH,
	assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH,
});
