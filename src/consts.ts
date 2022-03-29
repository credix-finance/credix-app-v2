import { IconName } from "@components/Icon";
import { Route } from "types/route.types";

export const defaultMarketplace = "credix-marketplace";

export const multisigUrl = "https://multisig.credix.finance/#/";

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
