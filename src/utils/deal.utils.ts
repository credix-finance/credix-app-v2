import { Deal, Fraction } from "@credix/credix-client";
import { toUIAmount } from "@utils/format.utils";
import Big from "big.js";

export const calculateMonthlyRepaymentAmount = (deal: Deal) => {
	if (!deal) {
		return;
	}

	return toUIAmount(deal.totalInterest.div(new Big(deal.timeToMaturity).div(30))).toNumber();
};

export const calculateInterestRepaidRatio = (deal: Deal) => {
	return new Fraction(deal.interestRepaid, deal.totalInterest.toNumber());
};

export const calculatePrincipalRepaidRatio = (deal: Deal) => {
	return new Fraction(deal.principalAmountRepaid, deal.principal);
};

export const calculateDaysRemainingRatio = (deal: Deal) => {
	return new Fraction(deal.daysRemaining, deal.timeToMaturity);
};
