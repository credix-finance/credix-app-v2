import React from "react";
import { Deal } from "@credix/credix-client";
import { Tag, TagType } from "@components/Tag";

interface DealStatusProps {
	deal: Deal;
}

export const DealStatus = ({ deal }: DealStatusProps) => {
	if (deal.isInProgress()) {
		return <Tag type={TagType.ACTIVE}>Active</Tag>;
	} else if (deal.isPending()) {
		return <Tag type={TagType.PENDING}>Pending</Tag>;
	}

	return <Tag type={TagType.ENDED}>Ended</Tag>;
};
