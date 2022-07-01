import React, { FunctionComponent } from "react";
import { classNames } from "@utils/format.utils";
import { Deal } from "@credix/credix-client";
import { useIntl } from "react-intl";
import { Tag } from "./Tag";

interface DealAdvancedSettingsProps {
	className?: string;
	slashInterestToPrincipal: boolean;
	slashPrincipalToInterest: boolean;
	trueWaterfall: boolean;
}

export const DealAdvancedSettings: FunctionComponent<DealAdvancedSettingsProps> = ({
	className,
	slashInterestToPrincipal,
	slashPrincipalToInterest,
	trueWaterfall,
}) => {
	const intl = useIntl();

	className = classNames([className, "flex flex-wrap gap-x-8 gap-y-4"]);

	return (
		<div className={className}>
			{slashInterestToPrincipal && (
				<Tag color="lightGray">
					{intl.formatMessage({
						defaultMessage: "Slash interest to principal",
						description: "Deal repayment schedule: review slash interest to principal",
					})}
				</Tag>
			)}
			{slashPrincipalToInterest && (
				<Tag color="lightGray">
					{intl.formatMessage({
						defaultMessage: "Slash principal to interest",
						description: "Deal repayment schedule: review slash principal to interest",
					})}
				</Tag>
			)}
			{trueWaterfall && (
				<Tag color="lightGray">
					{intl.formatMessage({
						defaultMessage: "True waterfall",
						description: "Deal repayment schedule: review true waterfall",
					})}
				</Tag>
			)}
		</div>
	);
};
