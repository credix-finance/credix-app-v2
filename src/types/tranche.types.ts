import { Fraction } from "@credix/credix-client";

export interface Tranche {
	name: string;
	apr: Fraction;
	value: number;
	percentageOfPrincipal: Fraction;
	percentageOfInterest: Fraction;
}

export enum TrancheName {
	SuperSenior = "Super senior",
	Senior = "Senior",
	Mezzanine = "Mezzanine",
	Junior = "Junior",
}

export enum TrancheTitle {
	OneTranche = "One tranche structure",
	TwoTranche = "Two tranche structure",
	ThreeTranche = "Three tranche structure",
	CustomTranche = "Custom Tranche Structure",
}

export enum TrancheFormValue {
	OneTranche = "oneTranche",
	TwoTranche = "twoTranche",
	ThreeTranche = "threeTranche",
	CustomTranche = "customTranche",
}
