import { DAYS_IN_YEAR, DefaultTranche, TrancheDataElement } from "@consts";
import { Fraction, RepaymentSchedule, Tranche } from "@credix/credix-client";
import { TokenAmount } from "@solana/web3.js";
import Big from "big.js";
import { capitalizeFirstLetter, round } from "./format.utils";

export const calculateTotalInterest = (
	timeToMaturity: number,
	financingFee: Fraction,
	principal: number
) => {
	const timeToMaturityRatio = new Fraction(timeToMaturity, 360);
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
	performanceFee,
	totalInterest,
	totalPrincipal,
	timeToMaturity,
}: {
	percentageOfInterest: Fraction;
	percentageOfPrincipal: Fraction;
	performanceFee: Fraction;
	totalInterest: number;
	totalPrincipal: number;
	timeToMaturity: number;
}) => {
	return new Fraction(
		Big(percentageOfInterest.toNumber())
			.times(Big(1).minus(performanceFee.toNumber()))
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
	performanceFee,
	totalInterest,
	totalPrincipal,
	timeToMaturity,
}) => {
	return new Fraction(
		Big(1)
			.minus(percentageOfInterest.toNumber())
			.times(
				Big(1)
					.minus(performanceFee.toNumber())
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
	performanceFee,
	totalInterest,
	totalPrincipal,
	timeToMaturity,
}) => {
	return new Fraction(
		Big(DAYS_IN_YEAR)
			.times(performanceFee.toNumber() - 1)
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
	performanceFee,
	totalInterest,
	totalPrincipal,
	timeToMaturity,
}) => {
	return new Fraction(
		Big(timeToMaturity)
			.times(totalPrincipal)
			.times(percentageOfPrincipal.toNumber())
			.times(apr.toNumber())
			.toNumber(),
		Big(360)
			.times(totalInterest)
			.minus(Big(360).times(performanceFee.toNumber()).times(totalInterest))
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
	performanceFee,
	totalInterest,
	totalPrincipal,
	timeToMaturity,
}) => {
	return mezAPR({
		percentageOfInterest: percentageOfInterestSenior,
		percentageOfPrincipal: percentageOfPrincipalSenior,
		performanceFee,
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
	performanceFee,
	totalInterest,
	totalPrincipal,
	timeToMaturity,
}) => {
	return new Fraction(
		Big(DAYS_IN_YEAR)
			.times(performanceFee.toNumber() - 1)
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
	performanceFee,
	totalInterest,
	totalPrincipal,
	timeToMaturity,
}) => {
	return new Fraction(
		Big(timeToMaturity)
			.times(totalPrincipal)
			.times(Big(percentageOfPrincipalSenior.toNumber() - 1).times(apr.toNumber()))
			.toNumber(),
		Big(DAYS_IN_YEAR)
			.times(Big(performanceFee.toNumber() - 1).times(totalInterest))
			.toNumber()
	);
};

export const threeTrancheSeniorPercentageOfPrincipal = ({
	percentageOfInterest,
	apr,
	performanceFee,
	totalInterest,
	totalPrincipal,
	timeToMaturity,
}: {
	percentageOfInterest: Fraction;
	apr: Fraction;
	performanceFee: Fraction;
	totalInterest: number;
	totalPrincipal: number;
	timeToMaturity: number;
}) => {
	return new Fraction(
		Big(DAYS_IN_YEAR)
			.times(performanceFee.toNumber() - 1)
			.times(totalInterest)
			.times(percentageOfInterest.toNumber())
			.times(-1)
			.toNumber(),
		Big(timeToMaturity).times(totalPrincipal).times(apr.toNumber()).toNumber()
	);
};

export const threeTrancheSeniorPercentageOfInterest = ({
	percentageOfPrincipal,
	apr,
	performanceFee,
	totalInterest,
	totalPrincipal,
	timeToMaturity,
}: {
	percentageOfPrincipal: Fraction;
	apr: Fraction;
	performanceFee: Fraction;
	totalInterest: number;
	totalPrincipal: number;
	timeToMaturity: number;
}) => {
	return new Fraction(
		Big(timeToMaturity)
			.times(totalPrincipal)
			.times(percentageOfPrincipal.toNumber())
			.times(apr.toNumber())
			.toNumber(),
		Big(360)
			.times(totalInterest)
			.minus(Big(360).times(performanceFee.toNumber()).times(totalInterest))
			.toNumber()
	);
};

export const threeTrancheMezAPR = ({
	percentageOfInterestMez,
	percentageOfPrincipalMez,
	performanceFee,
	totalInterest,
	totalPrincipal,
	timeToMaturity,
}: {
	percentageOfInterestMez: Fraction;
	percentageOfPrincipalMez: Fraction;
	performanceFee: Fraction;
	totalInterest: number;
	totalPrincipal: number;
	timeToMaturity: number;
}) => {
	return mezAPR({
		percentageOfInterest: percentageOfInterestMez,
		percentageOfPrincipal: percentageOfPrincipalMez,
		performanceFee,
		totalInterest,
		totalPrincipal,
		timeToMaturity,
	});
};

export const threeTrancheMezPercentageOfPrincipal = ({
	percentageOfInterestMez,
	apr,
	performanceFee,
	totalInterest,
	totalPrincipal,
	timeToMaturity,
}: {
	percentageOfInterestMez: Fraction;
	apr: Fraction;
	performanceFee: Fraction;
	totalInterest: number;
	totalPrincipal: number;
	timeToMaturity: number;
}) => {
	return new Fraction(
		Big(DAYS_IN_YEAR)
			.times(performanceFee.toNumber() - 1)
			.times(totalInterest)
			.times(percentageOfInterestMez.toNumber() - 1)
			.toNumber(),
		Big(timeToMaturity).times(totalPrincipal).times(apr.toNumber()).toNumber()
	);
};

export const threeTrancheMezPercentageOfInterest = ({
	percentageOfPrincipalMez,
	apr,
	performanceFee,
	totalInterest,
	totalPrincipal,
	timeToMaturity,
}: {
	percentageOfPrincipalMez: Fraction;
	apr: Fraction;
	performanceFee: Fraction;
	totalInterest: number;
	totalPrincipal: number;
	timeToMaturity: number;
}) => {
	return new Fraction(
		Big(timeToMaturity)
			.times(totalPrincipal)
			.times(Big(percentageOfPrincipalMez.toNumber() - 1).times(apr.toNumber()))
			.toNumber(),
		Big(DAYS_IN_YEAR)
			.times(Big(performanceFee.toNumber() - 1).times(totalInterest))
			.toNumber()
	);
};

export const threeTrancheJuniorAPR = ({
	percentageOfInterestSenior,
	percentageOfPrincipalSenior,
	percentageOfInterestMez,
	percentageOfPrincipalMez,
	performanceFee,
	totalInterest,
	totalPrincipal,
	timeToMaturity,
}: {
	percentageOfInterestSenior: Fraction;
	percentageOfPrincipalSenior: Fraction;
	percentageOfInterestMez: Fraction;
	percentageOfPrincipalMez: Fraction;
	performanceFee: Fraction;
	totalInterest: number;
	totalPrincipal: number;
	timeToMaturity: number;
}) => {
	return new Fraction(
		Big(1)
			.minus(percentageOfInterestSenior.toNumber())
			.minus(percentageOfInterestMez.toNumber())
			.times(
				Big(1)
					.minus(performanceFee.toNumber())
					.times(totalInterest)
					.div(totalPrincipal)
					.times(Big(DAYS_IN_YEAR).div(timeToMaturity))
			)
			.toNumber(),
		Big(1)
			.minus(percentageOfPrincipalSenior.toNumber())
			.minus(percentageOfPrincipalMez.toNumber())
			.toNumber()
	);
};

export const calculateInvestorPercentageOfTranche = (
	tranche: Tranche,
	userTrancheBalance: TokenAmount
) => {
	return new Fraction(userTrancheBalance.uiAmount, tranche.size.uiAmount);
};

// TODO: Add this to the client
export const investorProjectedReturns = (
	tranche: Tranche,
	repaymentSchedule: RepaymentSchedule,
	userTrancheBalance: TokenAmount,
	interestFee: Fraction
) => {
	if (!userTrancheBalance) {
		return Big(0);
	}

	const interestWithoutPerformanceFee = Big(repaymentSchedule.totalInterest.uiAmountString).minus(
		interestFee.apply(repaymentSchedule.totalInterest.uiAmount)
	);
	const trancheInterest = tranche.returnPercentage.apply(interestWithoutPerformanceFee.toNumber());
	const investorPercentageOfTranche = calculateInvestorPercentageOfTranche(
		tranche,
		userTrancheBalance
	);

	return investorPercentageOfTranche.apply(trancheInterest.toNumber());
};

// TODO: Add this to the client
export const investorCurrentReturns = (tranche: Tranche, userTrancheBalance: TokenAmount) => {
	const investorPercentageOfTranche = calculateInvestorPercentageOfTranche(
		tranche,
		userTrancheBalance
	);

	return round(
		investorPercentageOfTranche.apply(tranche.interestRepaid.uiAmount),
		Big.roundHalfEven
	);
};

export const parseTrancheCSV = (text: string) => {
	if (typeof text === "string") {
		const lines = text.trim().split("\n");

		const _headers = lines[0].split(",");

		// Remove headers
		lines.shift();

		const trancheData = lines
			.map((line) => line.trim().split(","))
			// Reject empty tranches
			.filter((tranche) => tranche[1] !== "0")
			.map((tranche) => {
				const trancheName = capitalizeFirstLetter(tranche[0]);
				let t = {
					apr: null,
					name: trancheName,
					percentageOfPrincipal: Big(tranche[1]).times(100).toNumber(),
					percentageOfInterest: Big(tranche[2]).times(100).toNumber(),
					value: 1,
				} as TrancheDataElement;

				if (trancheName !== "Senior") {
					t = {
						...t,
						earlyWithdrawalInterest: false,
						earlyWithdrawalPrincipal: false,
					};
				}

				return t;
			});

		return {
			title: "Custom Tranche Structure",
			value: "customTranche",
			trancheData,
		} as DefaultTranche;
	}
};
