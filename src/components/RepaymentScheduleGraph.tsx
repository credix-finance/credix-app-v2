import { Column, ColumnConfig } from "@ant-design/plots";
import { RepaymentScheduleGraphDataPoint } from "@credix_types/repaymentschedule.types";
import { FunctionComponent } from "react";
import * as Theme from "../../theme.js";
interface RepaymentScheduleGraphProps {
	data: RepaymentScheduleGraphDataPoint[];
	config?: Partial<ColumnConfig>;
}

export const RepaymentScheduleGraph: FunctionComponent<RepaymentScheduleGraphProps> = ({
	data,
	config = {},
}) => {
	const baseConfig = {
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
		tooltip: {
			customContent: (title, data) => {
				const [interest, principal] = data;

				return `<div style="padding: 8px; min-width: 120px;">
										<div style="display: flex; justify-content: space-between">
											<div>Period: </div>
											<div>${title}</div>
										</div>
										<div style="display: flex; justify-content: space-between; margin-top: 16px; margin-bottom: 8px">
											<div style="display: flex; align-items: center;">
												<div style="width: 8px; height: 8px; border-radius: 999999px; background-color: ${interest?.mappingData.color}"></div>
												<div style="margin-left: 8px">Interest: </div>
											</div>
											<div style="padding-left: 8px;">${interest?.value}</div>
										</div>
										<div style="display: flex; justify-content: space-between">
											<div style="display: flex; align-items: center;">
												<div style="width: 8px; height: 8px; border-radius: 999999px; background-color: ${principal?.mappingData.color}"></div>
												<div style="margin-left: 8px">Principal: </div>
											</div>
											<div style="padding-left: 8px;">${principal?.value}</div>
										</div>
								<div>`;
			},
		},
		...config,
	} as ColumnConfig;

	return <Column {...baseConfig} />;
};
