import { Deal, Fraction, RepaymentSchedule, Tranche, Tranches } from "@credix/credix-client";
import { daysToMilliseconds, toUIAmount } from "@utils/format.utils";
import Big from "big.js";

// TODO: move this to the client
export const calculateMonthlyRepaymentAmount = (repaymentSchedule: RepaymentSchedule) => {
	if (!repaymentSchedule) {
		return;
	}

	const monthlyPayment = Big(repaymentSchedule.totalInterest.uiAmount).div(
		new Big(repaymentSchedule.duration).div(30)
	);

	return toUIAmount(monthlyPayment).toNumber();
};

// TODO: move this to the client
export const calculateInterestRepaidRatio = (
	tranches: Tranches,
	repaymentSchedule: RepaymentSchedule
) => {
	const interestRepaid = tranches.tranches.reduce((acc: number, curr: Tranche) => {
		return acc + curr.interestRepaid.uiAmount;
	}, 0);

	return new Fraction(interestRepaid, repaymentSchedule.totalInterest.uiAmount);
};

// TODO: move this to the client
export const calculatePrincipalRepaidRatio = (
	tranches: Tranches,
	repaymentSchedule: RepaymentSchedule
) => {
	const principalRepaid = tranches.tranches.reduce((acc: number, curr: Tranche) => {
		return acc + curr.principalRepaid.uiAmount;
	}, 0);

	return new Fraction(principalRepaid, repaymentSchedule.totalPrincipal.uiAmount);
};

export const calculateDaysRemaining = (deal: Deal, repaymentSchedule: RepaymentSchedule) => {
	const today = new Date();
	const endDate = new Date(deal.goLiveAt * 1000 + daysToMilliseconds(repaymentSchedule.duration));
	const differenceInTime = endDate.getTime() - today.getTime();
	return differenceInTime / (1000 * 60 * 60 * 24);
};

// TODO: move this to the client
export const calculateDaysRemainingRatio = (deal: Deal, repaymentSchedule: RepaymentSchedule) => {
	const daysRemaining = calculateDaysRemaining(deal, repaymentSchedule);
	return new Fraction(daysRemaining, repaymentSchedule.duration);
};

// TODO: move this to the client
export const totalInterestRepaid = (tranches: Tranches) => {
	const interestRepaid = tranches.tranches.reduce((acc: number, curr: Tranche) => {
		return acc + curr.interestRepaid.uiAmount;
	}, 0);

	return interestRepaid;
};

// TODO: move this to the client
export const totalPrincipalRepaid = (tranches: Tranches) => {
	const principalRepaid = tranches.tranches.reduce((acc: number, curr: Tranche) => {
		return acc + curr.principalRepaid.uiAmount;
	}, 0);

	return principalRepaid;
};

// TODO: move this to the client
export const calculateFinancingFee = (repaymentSchedule: RepaymentSchedule) => {
	if (!repaymentSchedule) {
		return new Fraction(0, 1);
	}

	return new Fraction(
		repaymentSchedule.totalInterest.uiAmount,
		repaymentSchedule.totalPrincipal.uiAmount
	);
};

export const interestToRepay = async (tranches: Tranches) => {
	const repaid = await totalInterestRepaid(tranches);
	const total = await totalPrincipalRepaid(tranches);

	return repaid - total;
};
