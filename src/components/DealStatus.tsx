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
			<Tag type="active">
				{intl.formatMessage({
					defaultMessage: "Active",
					description: "Deal status: active",
				})}
			</Tag>
		);
	} else if (deal.isPending()) {
		return (
			<Tag type="pending">
				{intl.formatMessage({
					defaultMessage: "Pending",
					description: "Deal status: pending",
				})}
			</Tag>
		);
	}

	return (
		<Tag type="ended">
			{intl.formatMessage({
				defaultMessage: "Ended",
				description: "Deal status: ended",
			})}
		</Tag>
	);
};
