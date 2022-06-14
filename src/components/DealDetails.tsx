import React, { FunctionComponent } from "react";
import { Deal, RepaymentSchedule, Tranches } from "@credix/credix-client";
import { DealStatus } from "@components/DealStatus";
import DealAspectGrid from "@components/DealAspectGrid";
import { useIntl } from "react-intl";

interface DealDetailsProps {
	deal: Deal;
	tranches: Tranches;
	repaymentSchedule: RepaymentSchedule;
}

export const DealDetails: FunctionComponent<DealDetailsProps> = ({
	deal,
	tranches,
	repaymentSchedule,
}) => {
	const intl = useIntl();

	return (
		<div className="space-y-7">
			<DealStatus deal={deal} />
			<div className="text-neutral-60 w-max">
				<div className="capitalize">
					{intl.formatMessage({
						defaultMessage: "borrower key",
						description: "Deal details: borrower key",
					})}
				</div>
				<div className="px-4 py-3 border border-solid border-neutral-60">
					{deal.borrower.toString()}
				</div>
			</div>
			<DealAspectGrid deal={deal} tranches={tranches} repaymentSchedule={repaymentSchedule} />
		</div>
	);
};
