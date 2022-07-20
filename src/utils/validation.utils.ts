import { PublicKey } from "@solana/web3.js";
import { IntlShape, MessageDescriptor } from "react-intl";

export const validateMaxValue = (value: string, maxValue: number, validationMessage: string) => {
	if (!value || Number(value) <= maxValue) {
		// Do nothing
		return Promise.resolve();
	}

	return Promise.reject(validationMessage);
};

export const validateMinValue = (value: string, minValue: number, validationMessage: string) => {
	if (!value || Number(value) >= minValue) {
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

export const required = (intl: IntlShape, message: MessageDescriptor) => ({
	required: true,
	message: intl.formatMessage(message),
});
