import React, { FunctionComponent } from "react";
import { classNames } from "@utils/format.utils";
import { defineMessages, useIntl } from "react-intl";
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
				<Tag color="lightGray">{intl.formatMessage(MESSAGES.slashInterestToPrincipal)}</Tag>
			)}
			{slashPrincipalToInterest && (
				<Tag color="lightGray">{intl.formatMessage(MESSAGES.slashPrincipalToInterest)}</Tag>
			)}
			{trueWaterfall && <Tag color="lightGray">{intl.formatMessage(MESSAGES.trueWaterfall)}</Tag>}
		</div>
	);
};

const MESSAGES = defineMessages({
	slashInterestToPrincipal: {
		defaultMessage: "Slash interest to principal",
		description: "Deal advanced settings: slash interest to principal",
	},
	slashPrincipalToInterest: {
		defaultMessage: "Slash principal to interest",
		description: "Deal advanced settings: slash principal to interest",
	},
	trueWaterfall: {
		defaultMessage: "True waterfall",
		description: "Deal advanced settings: true waterfall",
	},
});
