import { IconName } from "@components/Icon"

export const defaultMarketplace = "credix-marketplace";

const invest = {
	icon: "line-chart" as IconName,
	label: "Invest",
	path: "/invest",
}

const deals = {
	icon: "line-chart" as IconName,
	label: "Deals",
	path: "/deals",
}

export const routes = [
	invest,
	deals
]
