import { Deal, Fraction, Tranche } from "@credix/credix-client";
import { daysToMilliseconds, toUIAmount } from "@utils/format.utils";
import Big from "big.js";

// TODO: move this to the client
export const calculateMonthlyRepaymentAmount = async (deal: Deal) => {
	if (!deal) {
		return;
	}
	const repaymentSchedule = await deal.fetchRepaymentSchedule();
	const monthlyPayment = Big(repaymentSchedule.totalInterest).div(
		new Big(repaymentSchedule.duration).div(30)
	);

	return toUIAmount(monthlyPayment).toNumber();
};

// TODO: move this to the client
export const calculateInterestRepaidRatio = async (deal: Deal) => {
	const { tranches } = await deal.fetchTranches();
	const interestRepaid = tranches.reduce((acc: number, curr: Tranche) => {
		return acc + curr.interestRepaid;
	}, 0);

	const repaymentSchedule = await deal.fetchRepaymentSchedule();

	return new Fraction(interestRepaid, repaymentSchedule.totalInterest);
};

// TODO: move this to the client
export const calculatePrincipalRepaidRatio = async (deal: Deal) => {
	const { tranches } = await deal.fetchTranches();
	const principalRepaid = tranches.reduce((acc: number, curr: Tranche) => {
		return acc + curr.principalRepaid;
	}, 0);

	const repaymentSchedule = await deal.fetchRepaymentSchedule();

	return new Fraction(principalRepaid, repaymentSchedule.totalPrincipal);
};

// TODO: move this to the client
export const calculateDaysRemainingRatio = async (deal: Deal) => {
	const repaymentSchedule = await deal.fetchRepaymentSchedule();
	const today = new Date();
	const endDate = new Date(deal.goLiveAt * 1000 + daysToMilliseconds(repaymentSchedule.duration));
	const differenceInTime = endDate.getTime() - today.getTime();
	const differenceInDays = differenceInTime / (1000 * 60 * 60 * 24);

	return new Fraction(differenceInDays, repaymentSchedule.duration);
};
