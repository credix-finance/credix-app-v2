import { Fraction } from "@credix/credix-client";

export interface Tranche {
	name: string;
	apr: Fraction;
	value: number;
	percentageOfPrincipal: Fraction;
	percentageOfInterest: Fraction;
}

export enum TrancheName {
	Senior = "Senior",
	Mezzanine = "Mezzanine",
	Junior = "Junior",
}
