import { IconName } from "@components/Icon";
import { Route } from "types/route.types";

export const marketplaces: string[] = [
	"credix-marketplace",
	"credix-test-marketplace",
	"credix-simulation-marketplace",
];
export const defaultMarketplace = marketplaces[0];

export const multisigUrl = "https://multisig.credix.finance/#/";

export const borrowerTypeformId = "yFTAJy3h";
export const investorTypeformId = "E98Qjiw9";

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
