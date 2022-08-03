import { defineConfig } from "cypress";

export default defineConfig({
	defaultCommandTimeout: 10000,
	requestTimeout: 40000,
	viewportHeight: 960,
	viewportWidth: 1536,
	video: false,
	screenshotOnRunFailure: false,
	e2e: {
		// We've imported your old cypress plugins here.
		// You may want to clean this up later by importing these.
		setupNodeEvents(on, config) {
			return require("./cypress/plugins/index.js")(on, config);
		},
	},
});
