import { PublicKey } from "@solana/web3.js";
import Big, { BigSource } from "big.js";

export const validateMaxValue = (
	value: BigSource,
	maxValue: BigSource,
	validationMessage: string
) => {
	if (!value || Big(value).lte(maxValue)) {
		// Do nothing
		return Promise.resolve();
	}

	return Promise.reject(validationMessage);
};

export const validateMinValue = (
	value: BigSource,
	minValue: BigSource,
	validationMessage: string
) => {
	if (!value || Big(value).gte(minValue)) {
		return Promise.resolve();
	}
	return Promise.reject(validationMessage);
};

export const validatePublicKey = (value: string, validationMessage: string) => {
	if (!value) {
		return Promise.resolve();
	}

	try {
		new PublicKey(value);

		return Promise.resolve();
	} catch {
		return Promise.reject(validationMessage);
	}
};
