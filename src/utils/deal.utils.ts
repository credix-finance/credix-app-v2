import { Deal, Ratio } from "@credix/credix-client";
import { toUIAmount } from "@utils/format.utils";
import Big from "big.js";

export const calculateMonthlyRepaymentAmount = (deal: Deal) => {
	if (!deal) {
		return;
	}

	return toUIAmount(new Big(deal.totalInterest.toNumber() / (deal.timeToMaturity / 30))).toNumber();
};

export const calculateInterestRepaidRatio = (deal: Deal) => {
	return new Ratio(
		toUIAmount(new Big(deal.interestRepaid)).toNumber(),
		toUIAmount(deal.totalInterest).toNumber()
	);
};

export const calculatePrincipalRepaidRatio = (deal: Deal) => {
	return new Ratio(
		toUIAmount(new Big(deal.principalAmountRepaid)).toNumber(),
		toUIAmount(new Big(deal.principal)).toNumber()
	);
};

export const calculateDaysRemainingRatio = (deal: Deal) => {
	return new Ratio(deal.daysRemaining, deal.timeToMaturity);
};
