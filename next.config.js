const withLess = require("next-with-less");
const lessOptions = require("./theme");

module.exports = withLess({
	// Less config
	lessLoaderOptions: {
		lessOptions,
	},
	// NextJS config
	reactStrictMode: true,
	basePath: process.env.NEXT_PUBLIC_BASE_PATH,
	assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH,
});
