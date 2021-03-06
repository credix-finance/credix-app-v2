// jest.config.js
const nextJest = require("next/jest");

const createJestConfig = nextJest({
	// Provide the path to your Next.js app to load next.config.js and .env files in your test environment
	dir: "./",
});

// Add any custom config to be passed to Jest
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
const customJestConfig = {
	preset: "ts-jest",
	setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
	// if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
	moduleDirectories: ["node_modules", "<rootDir>/"],
	testEnvironment: "jest-environment-jsdom",
	moduleNameMapper: {
		"^@components/(.*)": "<rootDir>/src/components/$1",
		"^@credix_types/(.*)": "<rootDir>/src/types/$1",
		"^@config/(.*)": "<rootDir>/src/config/$1",
		"^@consts": "<rootDir>/src/consts",
		"^@message": "<rootDir>/src/message",
		"^@notification": "<rootDir>/src/notification",
		"^@state/(.*)": "<rootDir>/src/state/$1",
		"^@utils/(.*)": "<rootDir>/src/utils/$1",
		"^csv-parse/browser/esm/sync": "<rootDir>/node_modules/csv-parse/dist/cjs/sync.cjs",
	},
	modulePathIgnorePatterns: ["__mocks__", ".yalc"],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
