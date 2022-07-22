const withLess = require("next-with-less");
const theme = require("./theme");
const { withSentryConfig } = require('@sentry/nextjs');

const moduleExports = withLess({
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

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);


