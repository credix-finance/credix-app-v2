import React, { FunctionComponent } from "react";
import { Deal } from "@credix/credix-client";
import { DealStatus } from "@components/DealStatus";
import DealAspectGrid from "@components/DealAspectGrid";

interface DealDetailsProps {
	deal: Deal;
}

export const DealDetails: FunctionComponent<DealDetailsProps> = ({ deal }) => {
	return (
		<div className="space-y-7">
			<DealStatus deal={deal} />
			<div className="text-neutral-60 w-max">
				<div>Borrower Key</div>
				<div className="px-4 py-3 border border-solid border-neutral-60">
					{deal.borrower.toString()}
				</div>
			</div>
			<DealAspectGrid deal={deal} />
		</div>
	);
};
