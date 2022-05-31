export enum RepaymentScheduleAmountType {
	INTEREST = "interest",
	PRINCIPAL = "principal",
}

export interface RepaymentScheduleDataPoint {
	month: string;
	type: RepaymentScheduleAmountType;
	amount: number;
}
