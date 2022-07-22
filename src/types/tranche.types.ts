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
	oneTranche = "One tranche structure",
	twoTranche = "Two tranche structure",
	threeTranche = "Three tranche structure",
}

export enum TrancheFormValue {
	oneTranche = "oneTranche",
	twoTranche = "twoTranche",
	threeTranche = "threeTranche",
}
