const primary = "#F1F1F1";
const secondary = "#D8DEDA";

const actionHover = "#ADC9B7";
const actionPrimary = "#398D88";
const actionDisable = "hsla(180, 9%, 74%, 0.51)";

const neutral100 = "#1F1F1F";
const neutral105 = "#1E1E1E";
const neutral90 = "#C4C4C4";
const neutral80 = "#0F0F0F";
const neutral60 = "#444152";
const neutral40 = "#9C99AE";
const neutral30 = "#B2B2B2";
const neutral35 = "#606060";
const neutral20 = "#718879";
const neutral10 = "#D8DEDA";
const neutral0 = "#FFFFFF";

const darker = "#151515";
const disabled = "hsla(0, 0%, 8%, 0.4)";

const green = "#45E498";
const orange = "#FA9537";
const yellow = "#FAE637";
const error = "#FF0202";
const lightGray = "#E5E9EB";
const midGray = "#B0BABF";
const darkGray = "#252C32";

module.exports = {
	colors: {
		credix: {
			primary: primary,
			secondary: secondary,
			green,
			orange,
			yellow,
			gray: {
				light: lightGray,
				mid: midGray,
				dark: darkGray,
			}
		},
		light: primary,
		dark: neutral100,
		darker: darker,
		error: error,
		action: {
			primary: actionPrimary,
			hover: actionHover,
			disable: actionDisable,
		},
		disabled: disabled,
		neutral: {
			105: neutral105,
			100: neutral100,
			90: neutral90,
			80: neutral80,
			60: neutral60,
			40: neutral40,
			30: neutral30,
			35: neutral35,
			20: neutral20,
			10: neutral10,
			0: neutral0,
		},
	},
	lessOptions: {
		modifyVars: {},
		javascriptEnabled: true,
	},
};
