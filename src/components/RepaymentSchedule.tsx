import React, { FunctionComponent, useState } from "react";
import { RepaymentScheduleGraph } from "./RepaymentScheduleGraph";
import { RepaymentScheduleTable } from "./RepaymentScheduleTable";
import { Button } from "./Button";
import {
	RepaymentScheduleGraphDataPoint,
	RepaymentScheduleTableDataPoint,
} from "@credix_types/repaymentschedule.types";
import { useIntl } from "react-intl";
import { ColumnConfig } from "@ant-design/charts";

interface RepaymentScheduleProps {
	graphData: RepaymentScheduleGraphDataPoint[];
	graphConfig?: Partial<ColumnConfig>;
	dataSource: RepaymentScheduleTableDataPoint[];
}
export const RepaymentSchedule: FunctionComponent<RepaymentScheduleProps> = ({
	graphData,
	dataSource,
	graphConfig,
}) => {
	const intl = useIntl();
	const [showTable, setShowTable] = useState(false);

	return (
		<div>
			<div className="grid grid-cols-2 gap-x-20 mb-8">
				<div className="flex flex-col justify-between">
					<div></div>
					<div>
						<Button onClick={() => setShowTable(!showTable)} type="text">
							{showTable &&
								intl.formatMessage({
									defaultMessage: "Hide table",
									description: "Deal form: repayment schedule hide table button",
								})}
							{!showTable &&
								intl.formatMessage({
									defaultMessage: "Show table",
									description: "Deal form: repayment schedule show table button",
								})}
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
