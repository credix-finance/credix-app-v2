import { Ratio } from "@credix/credix-client";
import Big, { RoundingMode } from "big.js";

type formatter = (value: number) => string;
export const clamp = (value: number, min: number, max: number) => {
	return Math.min(Math.max(value, min), max);
};

const roundingPrecision = 2;
const conversionFactor = new Big(10).pow(6);

export const numberFormatter = Intl.NumberFormat("en", {
	notation: "compact",
	minimumFractionDigits: 0,
	maximumFractionDigits: 1,
});

export const round = (n: Big, roundingMode: RoundingMode, precision = roundingPrecision) =>
	n.round(precision, roundingMode);

export const formatNumber = (n: Big, formatter: formatter) => formatter(n.toNumber());
export const ratioFormatter = Intl.NumberFormat("en", {
	style: "percent",
	minimumFractionDigits: 0,
	maximumFractionDigits: 1,
});

export const toUIAmount = (n: Big) => n.div(conversionFactor);

export const formatUIAmount = (n: Big, formatter: formatter) =>
	formatNumber(toUIAmount(n), formatter);

export const toProgramAmount = (n: Big) => n.mul(conversionFactor);

export const formatTimestamp = (timestamp, locale) => {
	// Most unix timestamps don't include milliseconds which causes the date to be parsed wrong
	const timestampWithMilliseconds = timestamp * 1000;
	return formatDate(new Date(timestampWithMilliseconds), locale);
};

export const formatDate = (date: Date, locale: string[]) => {
	const fallback = "en-US";
	const locales = locale && locale.length > 0 ? [...locale, fallback] : fallback;

	return Intl.DateTimeFormat(locales, { year: "numeric", month: "2-digit", day: "2-digit" }).format(
		date
	);
};
