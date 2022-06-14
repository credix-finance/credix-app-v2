import React, { FunctionComponent } from "react";
import { Deal, RepaymentSchedule, Tranches } from "@credix/credix-client";
import { DealKeys } from "@components/DealKeys";
import { DealAbstract } from "@components/DealAbstract";
import { DealRepaymentSchedule } from "@components/DealRepaymentSchedule";
import { DealTrancheStructure } from "@components/DealTrancheStructure";
import { DealTrancheInvest } from "./DealTrancheInvest";
import { DealHeader } from "./DealHeader";
import { Tag } from "./Tag";
import { useIntl } from "react-intl";

interface OpenForFundingProps {
	marketplace: string;
	deal: Deal;
	tranches: Tranches;
	repaymentSchedule: RepaymentSchedule;
}

export const OpenForFunding: FunctionComponent<OpenForFundingProps> = ({
	marketplace,
	deal,
	tranches,
	repaymentSchedule,
}) => {
	const intl = useIntl();
	const tag = (
		<Tag color="yellow">
			{intl.formatMessage({
				defaultMessage: "Open for funding",
				description: "Open for funding tag: text",
			})}
		</Tag>
	);

	return (
		<div>
			<DealHeader marketplace={marketplace} dealName={deal.name} tag={tag} />
			<DealKeys className="mt-8" dealAddress={deal.address} borrowerKey={deal.borrower} />
			<DealAbstract
				className="mt-10"
				amount={repaymentSchedule.totalPrincipal.uiAmount}
				timeToMaturity={repaymentSchedule.duration}
			/>
			<DealRepaymentSchedule className="mt-16" repaymentSchedule={repaymentSchedule} />
			<DealTrancheStructure
				className="mt-16"
				tranches={tranches}
				principal={repaymentSchedule.totalPrincipal.uiAmount}
			/>
			<DealTrancheInvest className="mt-16" tranches={tranches} />
		</div>
	);
};
