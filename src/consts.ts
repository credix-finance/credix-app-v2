import { IconName } from "@components/Icon";
import { Fraction } from "@credix/credix-client";
import { TokenAmount } from "@solana/web3.js";
import { Route } from "types/route.types";
import { colors as ThemeColors } from "../theme";

export const DAYS_IN_REPAYMENT_PERIOD = 30;
export const MONTHS_IN_YEAR = 12;
export const DAYS_IN_YEAR = 360;
export const MILLISECONDS_IN_DAY = 86_400_000;
export const SENIOR_TRANCHE_INDEX = 1;

export const marketplaces: string[] = [
	"credix-marketplace",
	"credix-test-marketplace",
	"credix-simulation-marketplace",
];
export const defaultMarketplace = marketplaces[0];

export const multisigUrl = "https://multisig.credix.finance/#/";

export const borrowerTypeformId = "Mtgs2OJ9";
export const investorTypeformId = "E98Qjiw9";

export const trancheColors = [
	ThemeColors.action.hover,
	ThemeColors.credix.secondary,
	ThemeColors.darker,
];

export const investWithdrawRoute: Route = {
	icon: "line-chart" as IconName,
	label: "Invest/Withdraw",
	path: "/invest-withdraw",
};

export const dealsRoute: Route = {
	icon: "line-chart" as IconName,
	label: "Deals",
	path: "/deals",
};

export const routes: Route[] = [investWithdrawRoute, dealsRoute];

export const oneTrancheStructure = {
	value: "oneTranche",
	title: "One tranche structure",
	trancheData: [
		{
			name: "Senior",
			apr: new Fraction(135, 1000),
			value: 1,
			percentageOfPrincipal: new Fraction(1, 1),
			percentageOfInterest: new Fraction(1, 1),
		},
		{
			name: "Mezzanine",
			apr: null,
			value: null,
			percentageOfPrincipal: null,
			percentageOfInterest: null,
		},
		{
			name: "Junior",
			apr: null,
			value: null,
			percentageOfPrincipal: null,
			percentageOfInterest: null,
		},
	],
};
export const twoTrancheStructure = {
	title: "Two tranche structure",
	value: "twoTranche",
	trancheData: [
		{
			name: "Senior",
			value: 0.8,
			apr: new Fraction(135, 1000),
			percentageOfPrincipal: new Fraction(10, 100),
			percentageOfInterest: new Fraction(80, 100),
		},
		{
			name: "Mezzanine",
			value: 0.2,
			apr: new Fraction(135, 1000),
			percentageOfPrincipal: new Fraction(90, 100),
			percentageOfInterest: new Fraction(20, 100),
		},
		{
			name: "Junior",
			apr: null,
			value: null,
			percentageOfPrincipal: null,
			percentageOfInterest: null,
		},
	],
};

export const threeTrancheStructure = {
	title: "Three tranche structure",
	value: "threeTranche",
	trancheData: [
		{
			name: "Senior",
			value: 0.75,
			apr: new Fraction(135, 1000),
			percentageOfPrincipal: new Fraction(10, 100),
			percentageOfInterest: new Fraction(20, 100),
		},
		{
			name: "Mezzanine",
			value: 0.2,
			apr: new Fraction(135, 1000),
			percentageOfPrincipal: new Fraction(15, 100),
			percentageOfInterest: new Fraction(25, 100),
		},
		{
			name: "Junior",
			value: 0.05,
			apr: new Fraction(135, 1000),
			percentageOfPrincipal: new Fraction(75, 100),
			percentageOfInterest: new Fraction(55, 100),
		},
	],
};

export const defaultTranches = [oneTrancheStructure, twoTrancheStructure, threeTrancheStructure];

export const trancheNames = ["super senior", "senior", "mezzanine", "junior"];
export const trancheFillColors = {
	2: {
		filled: "#656565",
		unfilled: "#151515",
	},
	3: {
		filled: "#29BA7480",
		unfilled: "#29BA74",
	},
};

export const zeroTokenAmount: TokenAmount = {
	amount: "0",
	decimals: 0,
	uiAmount: 0,
	uiAmountString: "0",
};
