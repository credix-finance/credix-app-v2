module.exports = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx}",
		"./src/components/**/*.{js,ts,jsx,tsx}",
		"./src/stories/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			fontFamily: {
				mono: [
					"'Jetbrains Mono'",
					...[
						"ui-monospace",
						"SFMono-Regular",
						"Menlo",
						"Monaco",
						"Consolas",
						"Liberation Mono",
						"Courier New",
					],
				],
			},
		},
	},
	plugins: [],
};
