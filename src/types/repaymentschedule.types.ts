export enum RepaymentScheduleAmountType {
	INTEREST = "interest",
	PRINCIPAL = "principal",
}

export interface RepaymentScheduleGraphDataPoint {
	month: string;
	type: RepaymentScheduleAmountType;
	amount: number;
}

export interface RepaymentScheduleTableDataPoint {
	date: string;
	principal: number;
	interest: number;
	balance: number;
}
