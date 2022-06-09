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
	date: Date;
	principal: number;
	interest: number;
	balance: number;
}
