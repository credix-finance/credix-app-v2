import { IconName } from "@components/Icon";
import { Ratio } from "@credix/credix-client";
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
				apr: new Ratio(135, 1000),
				value: 1,
				percentageOfPrincipal: new Ratio(1, 1),
				percentageOfInterest: new Ratio(1, 1),
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
	},
	{
		title: "Two tranche structure",
		value: "twoTranche",
		trancheData: [
			{
				name: "Senior",
				value: 0.8,
				apr: new Ratio(135, 1000),
				percentageOfPrincipal: new Ratio(10, 100),
				percentageOfInterest: new Ratio(20, 100),
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
				value: 0.2,
				apr: new Ratio(135, 1000),
				percentageOfPrincipal: new Ratio(10, 100),
				percentageOfInterest: new Ratio(20, 100),
			},
		],
	},
	{
		title: "Three tranche structure",
		value: "threeTranche",
		trancheData: [
			{
				name: "Senior",
				value: 0.75,
				apr: new Ratio(135, 1000),
				percentageOfPrincipal: new Ratio(10, 100),
				percentageOfInterest: new Ratio(20, 100),
			},
			{
				name: "Mezzanine",
				value: 0.2,
				apr: new Ratio(135, 1000),
				percentageOfPrincipal: new Ratio(15, 100),
				percentageOfInterest: new Ratio(25, 100),
			},
			{
				name: "Junior",
				value: 0.05,
				apr: new Ratio(135, 1000),
				percentageOfPrincipal: new Ratio(10, 100),
				percentageOfInterest: new Ratio(20, 100),
			},
		],
	},
];
