const primary = "##F1F1F1";
const secondary = "#D8DEDA";

const actionHover = "#ADC9B7";
const actionPress = "#398D88";
const actionDisable = "#003F3B";

const neutral100 = "#1E1E1E";
const neutral80 = "#0F0F0F";
const neutral60 = "#444152";
const neutral40 = "#9C99AE";
const neutral20 = "#718879";
const neutral10 = "#D8DEDA";
const neutral0 = "hsla(0, 100%, 100%, 0.58)";

const light = "#F1F1F1";
const dark = "#1F1F1F";
const darker = "#151515";

module.exports = {
	colors: {
		credix: {
			primary: primary,
			secondary: secondary,
		},
		light: light,
		dark: dark,
		darker: darker,
		action: {
			hover: actionHover,
			press: actionPress,
			disable: actionDisable,
		},
		neutral: {
			1000: neutral100,
			800: neutral80,
			600: neutral60,
			400: neutral40,
			200: neutral20,
			100: neutral10,
			0: neutral0,
		},
	},
	lessOptions: {
		modifyVars: {
			"@primary-color": primary,
		},
		javascriptEnabled: true,
	},
};
