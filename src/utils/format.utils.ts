import { MILLISECONDS_IN_DAY } from "@consts";
import { PublicKey, TokenAmount } from "@solana/web3.js";
import Big, { BigSource, RoundingMode } from "big.js";

type formatter = (value: number) => string;
export const clamp = (value: number, min: number, max?: number) => {
	if (max) {
		return Math.min(Math.max(value, min), max);
	}

	return Math.max(value, min);
};

const roundingPrecision = 2;
const conversionFactor = new Big(10).pow(6);

export const compactFormatter = Intl.NumberFormat("en", {
	notation: "compact",
	minimumFractionDigits: 0,
	maximumFractionDigits: 1,
});

export const currencyFormatter = Intl.NumberFormat("en", {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
});

export const round = (
	n: BigSource | TokenAmount,
	roundingMode: RoundingMode,
	precision = roundingPrecision
) => {
	if (isBig(n)) {
		return Big(n).round(precision, roundingMode);
	}

	if (isTokenAmount(n)) {
		return Big(n.uiAmount).round(precision, roundingMode);
	}

	return null;
};

export const isBig = (n: BigSource | TokenAmount): n is Big => {
	if (typeof n === "number" || typeof n === "string" || Object.hasOwn(n, "c")) {
		return true;
	}

	return false;
};

export const isTokenAmount = (n: BigSource | TokenAmount): n is TokenAmount => {
	if (isBig(n) || typeof n === "number" || typeof n === "string") {
		return false;
	}

	return Object.hasOwn(n, "uiAmountString");
};

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

export const classNames = (input: (string | boolean | null)[]) => {
	return input.filter(Boolean).join(" ");
};

export const daysToMilliseconds = (days: number) => {
	return MILLISECONDS_IN_DAY * days;
};

export const millisecondsToDays = (milliseconds: number) => {
	return milliseconds / MILLISECONDS_IN_DAY;
};

export const slicedBased58Key = (key: PublicKey | string) => {
	if (typeof key === "string") {
		return key.slice(0, 5) + ".." + key.slice(-5);
	}

	return key.toBase58().slice(0, 5) + ".." + key.toBase58().slice(-5);
};
