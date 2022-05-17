import { IconName } from "@components/Icon";
import { Route } from "types/route.types";
import { colors as ThemeColors } from "../theme";

export const DAYS_IN_REPAYMENT_PERIOD = 30;
export const MONTHS_IN_YEAR = 12;

export const marketplaces: string[] = [
	"credix-marketplace",
	"credix-test-marketplace",
	"credix-simulation-marketplace",
];
export const defaultMarketplace = marketplaces[0];

export const multisigUrl = "https://multisig.credix.finance/#/";

export const borrowerTypeformId = "XH8TF60V";
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

export const defaultTranches = [
	{
		value: "oneTranche",
		title: "One tranche structure",
		trancheData: [
			{
				name: "Senior",
				expectedApy: 0.1,
				value: 1,
			},
			{
				name: "Mezzanine",
				expectedApy: null,
				value: null,
			},
			{
				name: "Junior",
				expectedApy: null,
				value: null,
			},
		],
	},
	{
		title: "Two tranche structure",
		value: "twoTranche",
		trancheData: [
			{
				name: "Senior",
				expectedApy: 0.1,
				value: 0.8,
			},
			{
				name: "Mezzanine",
				expectedApy: null,
				value: null,
			},
			{
				name: "Junior",
				expectedApy: 0.23,
				value: 0.2,
			},
		],
	},
	{
		title: "Three tranche structure",
		value: "threeTranche",
		trancheData: [
			{
				name: "Senior",
				expectedApy: 0.1,
				value: 0.75,
			},
			{
				name: "Mezzanine",
				expectedApy: 0.17,
				value: 0.2,
			},
			{
				name: "Junior",
				expectedApy: 0.34,
				value: 0.05,
			},
		],
	},
];
