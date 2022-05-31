import { Column } from "@ant-design/plots";
import { RepaymentScheduleDataPoint } from "@credix_types/repaymentschedule.types";
import { FunctionComponent } from "react";
import * as Theme from "../../theme.js";
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
		legend: false as unknown as object,
		colorField: "type",
		color: [Theme.colors.credix.secondary, Theme.colors.neutral["20"]],
		label: false as unknown as object,
	};

	return <Column {...config} />;
};
