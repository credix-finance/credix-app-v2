import { IconName } from "@components/Icon";
import { Deal, Fraction } from "@credix/credix-client";
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

export interface DefaultTranche {
	value: string;
	title: string;
	trancheData: {
		name: string;
		apr: Fraction | null;
		value: number | null;
		percentageOfPrincipal: Fraction | null;
		percentageOfInterest: Fraction | null;
		earlyWithdrawalInterest?: boolean;
		earlyWithdrawalPrincipal?: boolean;
	}[];
}
export const oneTrancheStructure: DefaultTranche = {
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
export const twoTrancheStructure: DefaultTranche = {
	title: "Two tranche structure",
	value: "twoTranche",
	trancheData: [
		{
			name: "Senior",
			value: 0.8,
			apr: new Fraction(135, 1000),
			percentageOfPrincipal: new Fraction(80, 100),
			percentageOfInterest: new Fraction(622, 1000),
		},
		{
			name: "Mezzanine",
			value: 0.2,
			apr: new Fraction(135, 1000),
			percentageOfPrincipal: new Fraction(20, 100),
			percentageOfInterest: new Fraction(378, 1000),
			earlyWithdrawalPrincipal: true,
			earlyWithdrawalInterest: true,
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

export const threeTrancheStructure: DefaultTranche = {
	title: "Three tranche structure",
	value: "threeTranche",
	trancheData: [
		{
			name: "Senior",
			value: 0.75,
			apr: new Fraction(135, 1000),
			percentageOfPrincipal: new Fraction(80, 100),
			percentageOfInterest: new Fraction(52, 100),
		},
		{
			name: "Mezzanine",
			value: 0.2,
			apr: new Fraction(135, 1000),
			percentageOfPrincipal: new Fraction(15, 100),
			percentageOfInterest: new Fraction(30, 100),
			earlyWithdrawalPrincipal: true,
			earlyWithdrawalInterest: true,
		},
		{
			name: "Junior",
			value: 0.05,
			apr: new Fraction(135, 1000),
			percentageOfPrincipal: new Fraction(5, 100),
			percentageOfInterest: new Fraction(18, 100),
			earlyWithdrawalPrincipal: true,
			earlyWithdrawalInterest: true,
		},
	],
};

export const defaultTranches: DefaultTranche[] = [
	oneTrancheStructure,
	twoTrancheStructure,
	threeTrancheStructure,
];

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

export type DealAdvancedSettings = Pick<
	Deal,
	"trueWaterfall" | "slashInterestToPrincipal" | "slashPrincipalToInterest"
>;

export const defaultAdvancedSettings: DealAdvancedSettings = {
	trueWaterfall: false,
	slashInterestToPrincipal: true,
	slashPrincipalToInterest: true,
};

export type TrancheSettings = {
	earlyWithdrawalInterest: boolean;
	earlyWithdrawalPrincipal: boolean;
};
export type DealTrancheSettings = {
	oneTranche: {
		Senior: TrancheSettings;
		Mezzanine: TrancheSettings;
		Junior: TrancheSettings;
	};
	twoTranche: {
		Senior: TrancheSettings;
		Mezzanine: TrancheSettings;
		Junior: TrancheSettings;
	};
	threeTranche: {
		Senior: TrancheSettings;
		Mezzanine: TrancheSettings;
		Junior: TrancheSettings;
	};
};
export const defaultTrancheSettings: DealTrancheSettings = defaultTranches.reduce((obj, t) => {
	obj[t.value] = {
		...t.trancheData.reduce((obj, tranche) => {
			obj[tranche.name] = {
				earlyWithdrawalInterest: tranche.earlyWithdrawalInterest,
				earlyWithdrawalPrincipal: tranche.earlyWithdrawalPrincipal,
			};
			return obj;
		}, {}),
	};
	return obj;
}, {} as DealTrancheSettings);

// TODO: check casing of maxfundingDuration
export const newDealDefaults: DealAdvancedSettings &
	Pick<Deal, "lateFeePercentage" | "maxfundingDuration"> = {
	lateFeePercentage: new Fraction(0, 100),
	maxfundingDuration: 255,
	...defaultTrancheSettings,
	...defaultAdvancedSettings,
};
