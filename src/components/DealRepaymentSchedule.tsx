import React, { FunctionComponent, useState } from "react";
import { Icon, IconDimension } from "./Icon";
import { Button } from "./Button";
import { classNames } from "@utils/format.utils";
import { RepaymentSchedule } from "@credix/credix-client";
import { repaymentScheduleType } from "@utils/repayment.utils";
import { AmortizationRepaymentSchedule } from "./AmortizationRepaymentSchedule";
import { useIntl } from "react-intl";

interface DealRepaymentScheduleProps {
	className?: string;
	repaymentSchedule: RepaymentSchedule;
}

export const DealRepaymentSchedule: FunctionComponent<DealRepaymentScheduleProps> = ({
	className,
	repaymentSchedule,
}) => {
	const intl = useIntl();
	const [showDetails, setShowDetails] = useState(false);

	className = classNames([className, "space-y-6"]);
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
							<span className="capitalize">{repaymentScheduleType(repaymentSchedule)}</span>{" "}
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
						<AmortizationRepaymentSchedule repaymentSchedule={repaymentSchedule} />
					</div>
				)}
			</div>
		</div>
	);
};
