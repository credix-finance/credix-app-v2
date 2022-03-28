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
