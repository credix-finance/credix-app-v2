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
	return new Ratio(new Big(deal.interestRepaid).toNumber(), deal.totalInterest.toNumber());
};

export const calculatePrincipalRepaidRatio = (deal: Deal) => {
	return new Ratio(
		new Big(deal.principalAmountRepaid).toNumber(),
		new Big(deal.principal).toNumber()
	);
};

export const calculateDaysRemainingRatio = (deal: Deal) => {
	return new Ratio(deal.daysRemaining, deal.timeToMaturity);
};
