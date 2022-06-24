const withLess = require("next-with-less");
const theme = require("./theme");

module.exports = withLess({
	// Less config
	lessLoaderOptions: {
		lessOptions: theme.lessOptions,
	},
	// NextJS config
	// Disable strict mode as it made the active tab indicator dissapear
	// See https://github.com/react-component/tabs/pull/530
	reactStrictMode: false,
	basePath: process.env.NEXT_PUBLIC_BASE_PATH,
	assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH,
	trailingSlash: true,
	webpack(config, { dev, ...other }) {
		if (!dev) {
			// https://formatjs.io/docs/guides/advanced-usage#react-intl-without-parser-40-smaller
			config.resolve.alias["@formatjs/icu-messageformat-parser"] =
				"@formatjs/icu-messageformat-parser/no-parser";
		}

		config.resolve.fallback = { fs: false, stream: false, path: false };

		return config;
	},
});
