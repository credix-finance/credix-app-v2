import React, { FunctionComponent, useState } from "react";
import { RepaymentScheduleGraph } from "./RepaymentScheduleGraph";
import { RepaymentScheduleTable } from "./RepaymentScheduleTable";
import { Button } from "./Button";
import {
	RepaymentScheduleGraphDataPoint,
	RepaymentScheduleTableDataPoint,
} from "@credix_types/repaymentschedule.types";
import { defineMessages, useIntl } from "react-intl";
import { ColumnConfig } from "@ant-design/charts";

const logScaleGraphConfig = {
	yAxis: {
		type: "log",
		base: 10,
	},
} as Partial<ColumnConfig>;

interface RepaymentScheduleProps {
	graphData: RepaymentScheduleGraphDataPoint[];
	dataSource: RepaymentScheduleTableDataPoint[];
}

export const RepaymentSchedule: FunctionComponent<RepaymentScheduleProps> = ({
	graphData,
	dataSource,
}) => {
	const intl = useIntl();
	const [showTable, setShowTable] = useState(false);

	if (!dataSource) {
		return;
	}

	// Use a logarithmic scale for the graph for bullet loans
	let graphConfig: Partial<ColumnConfig> = {};
	// make a copy of periods
	const periods = [...dataSource];
	// pop the last period as it will contain the principal if the loan is of type bullet
	periods.pop();
	if (periods.every((dataPoint) => dataPoint.principal === 0)) {
		graphConfig = logScaleGraphConfig;
	}

	return (
		<div>
			<div className="grid grid-cols-2 gap-x-20 mb-8">
				<div className="flex flex-col justify-between">
					<div></div>
					<div>
						<Button onClick={() => setShowTable(!showTable)} type="text">
							{showTable && intl.formatMessage(MESSAGES.hideTable)}
							{!showTable && intl.formatMessage(MESSAGES.showTable)}
						</Button>
					</div>
				</div>
				<div className="text-right">
					<RepaymentScheduleGraph data={graphData} config={graphConfig} />
				</div>
			</div>
			{showTable && <RepaymentScheduleTable dataSource={dataSource} />}
		</div>
	);
};

const MESSAGES = defineMessages({
	hideTable: {
		defaultMessage: "Hide table",
		description: "Deal form: repayment schedule hide table button",
	},
	showTable: {
		defaultMessage: "Show table",
		description: "Deal form: repayment schedule show table button",
	},
});
