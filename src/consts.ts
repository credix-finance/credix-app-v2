import { IconName } from "@components/Icon";
import { Deal, Fraction } from "@credix/credix-client";
import { TrancheFormValue, TrancheName, TrancheTitle } from "@credix_types/tranche.types";
import { TokenAmount } from "@solana/web3.js";
import { BigSource } from "big.js";
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

export interface TrancheDataElement {
	name: string;
	apr: BigSource | null;
	value: number | null;
	percentageOfPrincipal: BigSource | null;
	percentageOfInterest: BigSource | null;
	earlyWithdrawalInterest?: boolean;
	earlyWithdrawalPrincipal?: boolean;
	editable: boolean;
}

export interface DefaultTranche {
	value: string;
	title: string;
	trancheData: TrancheDataElement[];
}

export const oneTrancheStructure: DefaultTranche = {
	title: TrancheTitle.oneTranche,
	value: TrancheFormValue.oneTranche,
	trancheData: [
		{
			name: TrancheName.Senior,
			apr: new Fraction(135, 1000).apply(100).toNumber(),
			value: 1,
			percentageOfPrincipal: new Fraction(1, 1).apply(100).toNumber(),
			percentageOfInterest: new Fraction(1, 1).apply(100).toNumber(),
			editable: false,
		},
		{
			name: TrancheName.Mezzanine,
			apr: null,
			value: null,
			percentageOfPrincipal: null,
			percentageOfInterest: null,
			editable: false,
		},
		{
			name: TrancheName.Junior,
			apr: null,
			value: null,
			percentageOfPrincipal: null,
			percentageOfInterest: null,
			editable: false,
		},
	],
};
export const twoTrancheStructure: DefaultTranche = {
	title: TrancheTitle.twoTranche,
	value: TrancheFormValue.twoTranche,
	trancheData: [
		{
			name: TrancheName.Senior,
			value: 0.8,
			apr: new Fraction(135, 1000).apply(100).toNumber(),
			percentageOfPrincipal: new Fraction(80, 100).apply(100).toNumber(),
			percentageOfInterest: new Fraction(622, 1000).apply(100).toNumber(),
			editable: true,
		},
		{
			name: TrancheName.Mezzanine,
			apr: null,
			value: null,
			percentageOfPrincipal: null,
			percentageOfInterest: null,
			editable: false,
		},
		{
			name: TrancheName.Junior,
			value: 0.2,
			apr: new Fraction(135, 1000).apply(100).toNumber(),
			percentageOfPrincipal: new Fraction(20, 100).apply(100).toNumber(),
			percentageOfInterest: new Fraction(378, 1000).apply(100).toNumber(),
			earlyWithdrawalPrincipal: false,
			earlyWithdrawalInterest: false,
			editable: true,
		},
	],
};

export const threeTrancheStructure: DefaultTranche = {
	title: TrancheTitle.threeTranche,
	value: TrancheFormValue.threeTranche,
	trancheData: [
		{
			name: TrancheName.Senior,
			value: 0.75,
			apr: new Fraction(135, 1000).apply(100).toNumber(),
			percentageOfPrincipal: new Fraction(80, 100).apply(100).toNumber(),
			percentageOfInterest: new Fraction(52, 100).apply(100).toNumber(),
			editable: true,
		},
		{
			name: TrancheName.Mezzanine,
			value: 0.2,
			apr: new Fraction(135, 1000).apply(100).toNumber(),
			percentageOfPrincipal: new Fraction(15, 100).apply(100).toNumber(),
			percentageOfInterest: new Fraction(30, 100).apply(100).toNumber(),
			earlyWithdrawalPrincipal: false,
			earlyWithdrawalInterest: false,
			editable: true,
		},
		{
			name: TrancheName.Junior,
			value: 0.05,
			apr: new Fraction(135, 1000).apply(100).toNumber(),
			percentageOfPrincipal: new Fraction(5, 100).apply(100).toNumber(),
			percentageOfInterest: new Fraction(18, 100).apply(100).toNumber(),
			earlyWithdrawalPrincipal: false,
			earlyWithdrawalInterest: false,
			editable: false,
		},
	],
};

export const defaultTranches: DefaultTranche[] = [
	oneTrancheStructure,
	twoTrancheStructure,
	threeTrancheStructure,
];

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
	apr: BigSource | null;
	percentageOfPrincipal: BigSource | null;
	percentageOfInterest: BigSource | null;
	earlyWithdrawalInterest: boolean;
	earlyWithdrawalPrincipal: boolean;
};
export type TrancheStructure = {
	Senior: TrancheSettings;
	Mezzanine: TrancheSettings;
	Junior: TrancheSettings;
};

export type OneTrancheStructure = Pick<TrancheStructure, TrancheName.Senior>;
export type TwoTrancheStructure = Pick<TrancheStructure, TrancheName.Senior | TrancheName.Junior>;
export type ThreeTrancheStructure = TrancheStructure;

export type DealTrancheSettings = {
	oneTranche: OneTrancheStructure;
	twoTranche: TwoTrancheStructure;
	threeTranche: ThreeTrancheStructure;
};

export const defaultTrancheSettings: DealTrancheSettings = defaultTranches.reduce((obj, t) => {
	obj[t.value] = {
		...t.trancheData.reduce((obj, tranche) => {
			obj[tranche.name] = {
				earlyWithdrawalInterest: tranche.earlyWithdrawalInterest,
				earlyWithdrawalPrincipal: tranche.earlyWithdrawalPrincipal,
				percentageOfPrincipal: tranche.percentageOfPrincipal?.toString(),
				percentageOfInterest: tranche.percentageOfInterest?.toString(),
				apr: tranche.apr?.toString(),
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
