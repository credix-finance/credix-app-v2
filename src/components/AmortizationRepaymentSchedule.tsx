import React, { FunctionComponent, ReactNode, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { Input } from "@components/Input";
import { RepaymentScheduleGraph } from "@components/RepaymentScheduleGraph";
import { RepaymentScheduleTable } from "@components/RepaymentScheduleTable";
import {
	RepaymentScheduleGraphDataPoint,
	RepaymentScheduleTableDataPoint,
} from "@credix_types/repaymentschedule.types";
import { Button } from "@components/Button";
import { repaymentSchedule } from "@utils/amortization.utils";
import { generateGraphAndTableData } from "@utils/repayment.utils";
import { Ratio } from "@credix/credix-client";

interface AmortizationRepaymentScheduleProps {
	principal: number;
	financingFee: number;
	timeToMaturity: number;
	children?: ReactNode;
}

export const AmortizationRepaymentSchedule: FunctionComponent<
	AmortizationRepaymentScheduleProps
> = ({ timeToMaturity, principal, financingFee }) => {
	const intl = useIntl();
	const [showTable, setShowTable] = useState(false);
	const [graphData, setGraphData] = useState<RepaymentScheduleGraphDataPoint[]>([]);
	const [dataSource, setDataSource] = useState<RepaymentScheduleTableDataPoint[]>();

	useEffect(() => {
		if (principal && financingFee && timeToMaturity) {
			const financingFeeRatio = new Ratio(financingFee, 100);
			const schedule = repaymentSchedule(principal, financingFeeRatio, timeToMaturity);

			const { graphData, dataSource } = generateGraphAndTableData(schedule);
			setGraphData(graphData);
			setDataSource(dataSource);
		}
	}, [principal, financingFee, timeToMaturity]);

	return (
		<div>
			<div className="grid grid-cols-2 gap-x-20 mb-8">
				<div className="flex flex-col justify-between">
					<Input
						label={intl.formatMessage({
							defaultMessage: "Grace period",
							description: "Deal form: repayment schedule grace period input label",
						})}
						description={intl.formatMessage({
							defaultMessage:
								"Grace period is a time period granted on which the borrower does not have to pay anything toward the loan",
							description: "Deal form: repayment schedule grace period input description",
						})}
						placeholder={intl.formatMessage({
							defaultMessage: "0 days",
							description: "Deal form: repayment schedule grace period input placeholder",
						})}
						disabled={true}
					/>
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
					<RepaymentScheduleGraph data={graphData} />
				</div>
			</div>
			{showTable && <RepaymentScheduleTable dataSource={dataSource} />}
		</div>
	);
};
