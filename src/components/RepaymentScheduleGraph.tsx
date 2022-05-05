import { Column } from "@ant-design/plots";
import { FunctionComponent } from "react";

export enum RepaymentScheduleAmountType {
	INTEREST = "interest",
	PRINCIPAL = "principal",
}

export interface RepaymentScheduleDataPoint {
	month: string;
	type: RepaymentScheduleAmountType;
	amount: number;
}

interface RepaymentScheduleGraphProps {
	data: RepaymentScheduleDataPoint[];
}

export const RepaymentScheduleGraph: FunctionComponent<RepaymentScheduleGraphProps> = ({
	data,
}) => {
	const config = {
		data,
		height: 200,
		width: 320,
		isStack: true,
		xField: "month",
		yField: "amount",
		seriesField: "type",
		legend: false,
		colorField: "type",
		color: ["#D8DEDA", "#718879"],
		label: false,
	};

	return <Column {...config} />;
};
