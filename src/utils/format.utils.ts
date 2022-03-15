import { Ratio } from "@credix/credix-client";
import Big, { RoundingMode } from "big.js";

const roundingPrecision = 2;
const conversionFactor = new Big(10).pow(6);

export const formatNumber = (n: Big, roundingMode: RoundingMode, formatter: any) =>
	formatter(n.round(roundingPrecision, roundingMode).toNumber());

export const toUIAmount = (n: Big) => n.div(conversionFactor);

export const formatUIAmount = (n: Big, roundingMode: RoundingMode, formatter: any) =>
	formatNumber(toUIAmount(n), roundingMode, formatter);

export const toProgramAmount = (n: Big) => n.mul(conversionFactor);

export const formatRatio = (r: Ratio) => {
	const numerator = new Big(r.numerator);
	const denominator = new Big(r.denominator);
	return numerator.div(denominator).mul(100);
};

export const formatTimestamp = (timestamp, locale) => {
	// Most unix timestamps don't include milliseconds which causes the date to be parsed wrong
	const timestampWithMilliseconds = timestamp * 1000;
	return formatDate(new Date(timestampWithMilliseconds), locale);
};

export const formatDate = (date, locale) => {
	const fallback = "en-GB";
	const locales = locale && locale.length > 0 ? [...locale, fallback] : fallback;

	return Intl.DateTimeFormat(locales).format(date);
};
