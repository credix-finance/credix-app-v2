import React, { FunctionComponent, useState } from "react";
import { Icon, IconDimension } from "./Icon";
import { Button } from "./Button";
import { classNames, formatDate } from "@utils/format.utils";
import { DealStatus, RepaymentSchedule } from "@credix/credix-client";
import { generateGraphAndTableData, repaymentScheduleType } from "@utils/repayment.utils";
import { RepaymentSchedule as Schedule } from "./RepaymentSchedule";
import { useIntl } from "react-intl";
import { DealAdvancedSettings } from "./DealAdvancedSettings";
import { DealWithNestedResources } from "@state/dealSlice";
import { DAYS_IN_REPAYMENT_PERIOD } from "@consts";
import { useLocales } from "@hooks/useLocales";
import dayjs from "dayjs";

interface DealRepaymentScheduleProps {
	className?: string;
	deal: DealWithNestedResources;
	dealStatus: DealStatus;
}

export const DealRepaymentSchedule: FunctionComponent<DealRepaymentScheduleProps> = ({
	className,
	deal,
	dealStatus,
}) => {
	const intl = useIntl();
	const locales = useLocales();
	const [showDetails, setShowDetails] = useState(false);
	const goLiveAt = deal.goLiveAt * 1000;
	const showRepaid = DealStatus.IN_PROGRESS === dealStatus || DealStatus.CLOSED === dealStatus;

	className = classNames([className, "space-y-6"]);

	const repaymentScheduleComponent = (repaymentSchedule: RepaymentSchedule) => {
		const { graphData, dataSource } = generateGraphAndTableData(
			repaymentSchedule.periods.map((p, index) => ({
				day: goLiveAt
					? formatDate(
							dayjs(goLiveAt)
								.add((index + 1) * DAYS_IN_REPAYMENT_PERIOD, "day")
								.toDate(),
							locales as string[]
					  )
					: undefined,
				cumulativeInterest: p.cumulativeInterest.uiAmount,
				cumulativePrincipal: p.cumulativePrincipal.uiAmount,
				interest: p.interest.uiAmount,
				principal: p.principal.uiAmount,
				repaid: p.totalRepaid?.uiAmount,
			}))
		);

		return <Schedule graphData={graphData} dataSource={dataSource} showRepaid={showRepaid} />;
	};

	return (
		<div className={className}>
			<div className="font-sans font-semibold text-3xl">
				{intl.formatMessage({
					defaultMessage: "Repayment schedule",
					description: "Deal repayment schedule: title",
				})}
			</div>
			<div className="border border-neutral-40 p-6">
				<div className="flex justify-between">
					<div>
						<div className="font-mono font-normal text-base">
							{intl.formatMessage({
								defaultMessage: "Type of loan repayment structure",
								description: "Deal repayment schedule: type of loan repayment structure",
							})}
						</div>
						<div className="font-mono font-bold text-lg">
							<span className="capitalize">{repaymentScheduleType(deal.repaymentSchedule)}</span>{" "}
							{intl.formatMessage({
								defaultMessage: "loan",
								description: "Deal repayment schedule: loan",
							})}
						</div>
					</div>
					<Button type="text" className="flex" onClick={() => setShowDetails(!showDetails)}>
						{/* TODO: remove underline */}
						<div className="font-bold">
							{showDetails &&
								intl.formatMessage({
									defaultMessage: "Hide details",
									description: "Deal repayment schedule: hide details",
								})}
							{!showDetails &&
								intl.formatMessage({
									defaultMessage: "Show details",
									description: "Deal repayment schedule: show details",
								})}
						</div>
						<Icon name="arrow-down" size={IconDimension.MIDDLE} />
					</Button>
				</div>
				{showDetails && (
					<div className="mt-8">
						<DealAdvancedSettings
							slashInterestToPrincipal={deal.slashInterestToPrincipal}
							slashPrincipalToInterest={deal.slashPrincipalToInterest}
							trueWaterfall={deal.trueWaterfall}
							className="mb-8"
						/>
						{repaymentScheduleComponent(deal.repaymentSchedule)}
					</div>
				)}
			</div>
		</div>
	);
};
