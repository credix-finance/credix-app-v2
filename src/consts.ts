import { IconName } from "@components/Icon";
import { Route } from "types/route.types";

export const defaultMarketplace = "credix-marketplace";

const investWithdraw = {
	icon: "line-chart" as IconName,
	label: "Invest/Withdraw",
	path: "/invest-withdraw",
};

const invest = {
	icon: "line-chart" as IconName,
	label: "Invest",
	path: "/invest",
};

const deals = {
	icon: "line-chart" as IconName,
	label: "Deals",
	path: "/deals",
};

export const routes: Route[] = [investWithdraw, invest, deals];
