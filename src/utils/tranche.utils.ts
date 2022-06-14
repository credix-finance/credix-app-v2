import { DAYS_IN_YEAR } from "@consts";
import { Ratio } from "@credix/credix-client";
import Big from "big.js";
import { round } from "./format.utils";

/**
 * Based on the following formula:
 *
 * [1 - Fi] * Ti * Diy
 * -------------------
 *     Tp * Ttm
 *
 * where:
 *
 * Fi = interest fee of the market
 * Ti = Total interest
 * Diy = Days in year
 * Tp = total principal
 * Ttm = time to maturity in days
 *
 */
export const seniorAPR = ({
	percentageOfInterest,
	percentageOfPrincipal,
	interestFee,
	totalInterest,
	totalPrincipal,
	timeToMaturity,
}: {
	percentageOfInterest: Ratio;
	percentageOfPrincipal: Ratio;
	interestFee: Ratio;
	totalInterest: number;
	totalPrincipal: number;
	timeToMaturity: number;
}) => {
	return new Ratio(
		Big(percentageOfInterest.toNumber())
			.times(Big(1).minus(interestFee.toNumber()))
			.times(totalInterest)
			.times(DAYS_IN_YEAR)
			.toNumber(),
		Big(percentageOfPrincipal.toNumber()).times(totalPrincipal).times(timeToMaturity).toNumber()
	);
};

export const calculateTotalInterest = (
	timeToMaturity: number,
	financingFee: Ratio,
	principal: number
) => {
	const timeToMaturityRatio = new Ratio(timeToMaturity, 360);
	const interest = financingFee.apply(principal);
	const totalInterest = timeToMaturityRatio.apply(interest.toNumber());

	return round(totalInterest, Big.roundDown);
};
