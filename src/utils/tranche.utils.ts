import { DAYS_IN_YEAR } from "@consts";
import { Ratio } from "@credix/credix-client";
import { Tranche } from "@credix_types/tranche.types";
import Big from "big.js";
import { round } from "./format.utils";

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

/**
 * Based on the following formula:
 *
 * [1 - I] * [1 - Fi] * Ti * Diy
 * ------------------------------
 *     [1 - P] * Tp * Ttm
 *
 * where:
 *
 * I = percentage of interest
 * P = percentage of principal
 * Fi = interest fee of the market
 * Ti = Total interest
 * Diy = Days in year
 * Tp = total principal
 * Ttm = time to maturity in days
 *
 */
const mezAPR = ({
	percentageOfInterest,
	percentageOfPrincipal,
	interestFee,
	totalInterest,
	totalPrincipal,
	timeToMaturity,
}) => {
	return new Ratio(
		Big(1)
			.minus(percentageOfInterest.toNumber())
			.times(
				Big(1)
					.minus(interestFee.toNumber())
					.times(totalInterest)
					.div(totalPrincipal)
					.times(Big(DAYS_IN_YEAR).div(timeToMaturity))
			)
			.toNumber(),
		Big(1).minus(percentageOfPrincipal.toNumber()).toNumber()
	);
};

/**
 * Based on the following formula:
 *
 *    Diy * [Fi - 1] * Ti * Is
 * - ------------------------------
 *          As * Tp * Ttm
 *
 * where:
 *
 * I = percentage of interest senior tranche
 * Fi = interest fee of the market
 * Ti = Total interest
 * Diy = Days in year
 * Tp = total principal
 * Ttm = time to maturity in days
 * As = APR senior tranche
 *
 */
export const twoTrancheSeniorPercentageOfPrincipal = ({
	percentageOfInterest,
	apr,
	interestFee,
	totalInterest,
	totalPrincipal,
	timeToMaturity,
}) => {
	return new Ratio(
		Big(DAYS_IN_YEAR)
			.times(interestFee.toNumber() - 1)
			.times(totalInterest)
			.times(percentageOfInterest.toNumber())
			.times(-1)
			.toNumber(),
		Big(timeToMaturity).times(totalPrincipal).times(apr.toNumber()).toNumber()
	);
};

/**
 * Based on the following formula:
 *
 *    Diy * [Fi - 1] * Ti * I
 * - ------------------------------
 *          A * Tp * Ttm
 *
 * where:
 *
 * I = percentage of interest
 * Fi = interest fee of the market
 * Ti = Total interest
 * Diy = Days in year
 * Tp = total principal
 * Ttm = time to maturity in days
 * A = APR
 *
 */
export const twoTrancheSeniorPercentageOfInterest = ({
	percentageOfPrincipal,
	apr,
	interestFee,
	totalInterest,
	totalPrincipal,
	timeToMaturity,
}) => {
	return new Ratio(
		Big(timeToMaturity)
			.times(totalPrincipal)
			.times(percentageOfPrincipal.toNumber())
			.times(apr.toNumber())
			.toNumber(),
		Big(360)
			.times(totalInterest)
			.minus(Big(360).times(interestFee.toNumber()).times(totalInterest))
			.toNumber()
	);
};

/**
 * Based on the following formula:
 *
 * [1 - Is] * [1 - Fi] * Ti * Diy
 * ------------------------------
 *     [1 - Ps] * Tp * Ttm
 *
 * where:
 *
 * Fi = interest fee of the market
 * Ti = Total interest
 * Diy = Days in year
 * Tp = total principal
 * Ttm = time to maturity in days
 * Is = percentage of interest senior tranche
 * Ps = percentage of principal senior tranche
 *
 */
export const twoTrancheJuniorAPR = ({
	percentageOfInterestSenior,
	percentageOfPrincipalSenior,
	interestFee,
	totalInterest,
	totalPrincipal,
	timeToMaturity,
}) => {
	return mezAPR({
		percentageOfInterest: percentageOfInterestSenior,
		percentageOfPrincipal: percentageOfPrincipalSenior,
		interestFee,
		totalInterest,
		totalPrincipal,
		timeToMaturity,
	});
};

/**
 * Based on the following formula:
 *
 *       Ttm * Tp * (Ps - 1) * Aj
 *  1 - ------------------------
 *       Diy * (Fi - 1) * Ti
 *
 * where:
 *
 * Fi = interest fee of the market
 * Ti = Total interest
 * Diy = Days in year
 * Tp = total principal
 * Ttm = time to maturity in days
 * Aj = APR junior tranche
 * Ps = Percentage of principal senior tranche
 */
export const twoTrancheJuniorPercentageOfPrincipal = ({
	percentageOfInterestSenior,
	apr,
	interestFee,
	totalInterest,
	totalPrincipal,
	timeToMaturity,
}) => {
	return new Ratio(
		Big(DAYS_IN_YEAR)
			.times(interestFee.toNumber() - 1)
			.times(totalInterest)
			.times(percentageOfInterestSenior.toNumber() - 1)
			.toNumber(),
		Big(timeToMaturity).times(totalPrincipal).times(apr.toNumber()).toNumber()
	);
};

/**
 * Based on the following formula:
 *
 *       Diy * (Fi - 1) * Ti * (Is - 1)
 *  1 - -------------------------------
 *       	Ttm * Tp * Aj
 *
 * where:
 *
 * Fi = interest fee of the market
 * Ti = Total interest
 * Diy = Days in year
 * Tp = total principal
 * Ttm = time to maturity in days
 * Aj = APR junior tranche
 * Is = Percentage of interest senior tranche
 */
export const twoTrancheJuniorPercentageOfInterest = ({
	percentageOfPrincipalSenior,
	apr,
	interestFee,
	totalInterest,
	totalPrincipal,
	timeToMaturity,
}) => {
	return new Ratio(
		Big(timeToMaturity)
			.times(totalPrincipal)
			.times(Big(percentageOfPrincipalSenior.toNumber() - 1).times(apr.toNumber()))
			.toNumber(),
		Big(DAYS_IN_YEAR)
			.times(Big(interestFee.toNumber() - 1).times(totalInterest))
			.toNumber()
	);
};

export const calculateTrancheAprs = (tranches: Tranche[], params: CalculateSeniorOnlyAPRParams) => {
	const trancheCount = tranches.filter((t) => t.value).length;

	switch (trancheCount) {
		case 1:
			return [calculateSeniorOnlyAPR(params)];
		case 2:
			return [
				calculateTwoTrancheSeniorAPR({
					percentageOfInterest: tranches[0].percentageOfInterest,
					percentageOfPrincipal: tranches[0].percentageOfPrincipal,
					...params,
				}),
				null,
				calculateTwoTrancheJuniorAPR({
					percentageOfInterest: tranches[2].percentageOfInterest,
					percentageOfPrincipal: tranches[2].percentageOfPrincipal,
					...params,
				}),
			];
		case 3:
			return [
				calculateThreeTrancheSeniorAPR({
					percentageOfInterest: tranches[0].percentageOfInterest,
					percentageOfPrincipal: tranches[0].percentageOfPrincipal,
					...params,
				}),
				calculateThreeTrancheMezAPR({
					percentageOfInterest: tranches[1].percentageOfInterest,
					percentageOfPrincipal: tranches[1].percentageOfPrincipal,
					...params,
				}),
				calculateThreeTrancheJuniorAPR({
					senior: tranches[0],
					mez: tranches[1],
					...params,
				}),
			];

		default:
			break;
	}
};
