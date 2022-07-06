import React, { FunctionComponent } from "react";
import { classNames } from "@utils/format.utils";
import { defineMessages, useIntl } from "react-intl";
import { Tag } from "./Tag";

interface TrancheAdvancedSettingsProps {
	className?: string;
	trancheName: string;
	earlyWithdrawalInterest: boolean;
	earlyWithdrawalPrincipal: boolean;
}

export const TrancheAdvancedSettings: FunctionComponent<TrancheAdvancedSettingsProps> = ({
	className,
	trancheName,
	earlyWithdrawalInterest,
	earlyWithdrawalPrincipal,
}) => {
	const intl = useIntl();

	className = classNames([className, "flex flex-wrap gap-x-10 gap-y-4"]);

	return (
		<div className={className}>
			<div className="w-24 font-bold text-base">{trancheName}</div>
			<div className={!earlyWithdrawalPrincipal && "invisible"}>
				{earlyWithdrawalPrincipal && (
					<Tag color="lightGray">{intl.formatMessage(MESSAGES.earlyWithdrawalPrincipal)}</Tag>
				)}
			</div>
			<div className={!earlyWithdrawalInterest && "invisible"}>
				{earlyWithdrawalInterest && (
					<Tag color="lightGray">{intl.formatMessage(MESSAGES.earlyWithdrawalInterest)}</Tag>
				)}
			</div>
		</div>
	);
};

const MESSAGES = defineMessages({
	earlyWithdrawalInterest: {
		defaultMessage: "Interest withdrawal",
		description: "Tranche advanced settings: interest withdrawal",
	},
	earlyWithdrawalPrincipal: {
		defaultMessage: "Principal withdrawal",
		description: "Deal advanced settings: principal withdrawal",
	},
});
