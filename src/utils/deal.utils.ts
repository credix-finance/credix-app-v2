import {
	Deal,
	Fraction,
	RepaymentSchedule,
	CredixPass,
	RepaymentPeriod,
} from "@credix/credix-client";
import { clamp, daysToMilliseconds, toUIAmount } from "@utils/format.utils";
import { PublicKey } from "@solana/web3.js";
import { DealWithNestedResources } from "@state/dealSlice";
import Big from "big.js";

export const isDealRepayableByUser = async (
	user: PublicKey | null,
	deal: DealWithNestedResources,
	credixPass: CredixPass | null
) => {
	if (!user) {
		return false;
	}

	if (!credixPass || !credixPass.isActive) {
		return false;
	}

	const isInProgress = await deal.isInProgress(deal.repaymentSchedule);
	const userIsBorrower = user && deal.borrower.equals(user);

	return isInProgress && userIsBorrower;
};

export const isDealVisible = (
	user: PublicKey | null,
	deal: DealWithNestedResources,
	credixPass: CredixPass | null,
	isAdmin: boolean
) => {
	if (!user) {
		return false;
	}

	if (isAdmin) {
		return true;
	}

	if (!credixPass || !credixPass.isActive) {
		return false;
	}

	if (credixPass.isInvestor) {
		return true;
	}

	return deal.borrower.equals(user);
};

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
export const calculateInterestRepaidRatio = (repaymentSchedule: RepaymentSchedule) => {
	const interestRepaid = totalInterestRepaid(repaymentSchedule);

	return new Fraction(interestRepaid, repaymentSchedule.totalInterest.uiAmount);
};

// TODO: move this to the client
export const calculatePrincipalRepaidRatio = (repaymentSchedule: RepaymentSchedule) => {
	const principalRepaid = totalPrincipalRepaid(repaymentSchedule);

	return new Fraction(principalRepaid, repaymentSchedule.totalPrincipal.uiAmount);
};

export const calculateDaysRemaining = (deal: Deal, repaymentSchedule: RepaymentSchedule) => {
	const today = new Date();
	const endDate = new Date(deal.goLiveAt * 1000 + daysToMilliseconds(repaymentSchedule.duration));
	const differenceInTime = endDate.getTime() - today.getTime();
	return clamp(differenceInTime / (1000 * 60 * 60 * 24), 0);
};

// TODO: move this to the client
export const calculateDaysRemainingRatio = (deal: Deal, repaymentSchedule: RepaymentSchedule) => {
	const daysRemaining = calculateDaysRemaining(deal, repaymentSchedule);
	return new Fraction(daysRemaining, repaymentSchedule.duration);
};

// TODO: move this to the client
export const totalInterestRepaid = (repaymentSchedule: RepaymentSchedule) => {
	const interestRepaid = repaymentSchedule.periods.reduce((acc: number, curr: RepaymentPeriod) => {
		return acc + curr.interestRepaid.uiAmount;
	}, 0);

	return interestRepaid;
};

// TODO: move this to the client
export const totalPrincipalRepaid = (repaymentSchedule: RepaymentSchedule) => {
	const principalRepaid = repaymentSchedule.periods.reduce((acc: number, curr: RepaymentPeriod) => {
		return acc + Number(curr.principalRepaid.uiAmount);
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

export const totalMissingAmount = (repaymentSchedule: RepaymentSchedule) => {
	return repaymentSchedule.periods.reduce((acc, curr) => {
		return acc + curr.totalToRepay.uiAmount;
	}, 0);
};

export const interestToRepay = (repaymentSchedule: RepaymentSchedule) => {
	const repaid = totalInterestRepaid(repaymentSchedule);
	const total = repaymentSchedule.totalInterest.uiAmount;

	return total - repaid;
};
