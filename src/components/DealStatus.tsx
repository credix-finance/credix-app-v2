import React from "react";
import { Deal } from "@credix/credix-client";
import { Tag } from "./Tag";
import { useIntl } from "react-intl";

interface DealStatusProps {
	deal: Deal;
}

export const DealStatus = ({ deal }: DealStatusProps) => {
	const intl = useIntl();

	if (deal.isInProgress()) {
		return (
			<Tag color="green">
				{intl.formatMessage({
					defaultMessage: "Active",
					description: "Deal status: active",
				})}
			</Tag>
		);
	} else if (deal.isPending()) {
		return (
			<Tag color="lightGray">
				{intl.formatMessage({
					defaultMessage: "Pending",
					description: "Deal status: pending",
				})}
			</Tag>
		);
	}

	return (
		<Tag color="yellow">
			{intl.formatMessage({
				defaultMessage: "Ended",
				description: "Deal status: ended",
			})}
		</Tag>
	);
};
