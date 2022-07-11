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

export interface RepaymentScheduleTableDataPoint {
	day: string | number;
	principal: number;
	interest: number;
	balance: number;
}

export interface RepaymentSchedulePeriod {
	day?: string;
	cumulativeInterest: number;
	cumulativePrincipal: number;
	interest: number;
	principal: number;
}
