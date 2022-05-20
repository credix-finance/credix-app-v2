import { Ratio } from "@credix/credix-client";

export interface Tranche {
	name: string;
	apr: Ratio;
	value: number;
	percentageOfPrincipal: Ratio;
	percentageOfInterest: Ratio;
	senior?: {
		percentageOfPrincipal: Ratio;
		percentageOfInterest: Ratio;
	};
	mez?: {
		percentageOfPrincipal: Ratio;
		percentageOfInterest: Ratio;
	};
}
