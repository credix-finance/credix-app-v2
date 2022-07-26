export enum RepaymentScheduleAmountType {
	INTEREST = "interest",
	PRINCIPAL = "principal",
}

export enum RepaymentScheduleType {
	AMORTIZATION = "amortization",
	BULLET = "bullet",
}

export interface RepaymentScheduleGraphDataPoint {
	month: string;
	type: RepaymentScheduleAmountType;
	amount: number;
}

export interface RepaymentSchedulePeriod {
	day?: string | number;
	cumulativeInterest: number;
	cumulativePrincipal: number;
	interest: number;
	principal: number;
	repaid?: number;
}

export type RepaymentScheduleTableDataPoint = Pick<
	RepaymentSchedulePeriod,
	"day" | "interest" | "principal" | "repaid"
>;
