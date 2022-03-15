import React from "react";
import { Deal } from "@credix/credix-client";
import { Tag } from "./Tag";

interface DealStatusProps {
	deal?: Deal;
}

export const DealStatus = ({ deal }: DealStatusProps) => {
	if (!deal) {
		return null;
	}

	if (deal.isInProgress()) {
		return <Tag type="active">Active</Tag>;
	} else if (deal.isPending()) {
		return <Tag type="pending">Pending</Tag>;
	}

	return <Tag type="ended">Ended</Tag>;
};
