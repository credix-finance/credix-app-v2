import React, { FunctionComponent } from "react";
import { Deal, RepaymentSchedule, Tranches } from "@credix/credix-client";
import { DealKeys } from "@components/DealKeys";
import { DealAbstract } from "@components/DealAbstract";
import { DealRepaymentSchedule } from "@components/DealRepaymentSchedule";
import { DealTrancheStructure } from "@components/DealTrancheStructure";
import { DealHeader } from "./DealHeader";
import { useIntl } from "react-intl";
import { Tag } from "./Tag";
import { Button } from "./Button";
import { useStore } from "@state/useStore";
import { multisigUrl } from "@consts";

interface PendingProps {
	marketplace: string;
	deal: Deal;
	tranches: Tranches;
	repaymentSchedule: RepaymentSchedule;
}

export const Pending: FunctionComponent<PendingProps> = ({
	marketplace,
	deal,
	tranches,
	repaymentSchedule,
}) => {
	const isAdmin = useStore((state) => state.isAdmin);
	const intl = useIntl();

	const activateDeal = async () => {
		window.open(multisigUrl, "_blank") || window.location.replace(multisigUrl);
	};

	const tag = (
		<Tag color="midGray">
			{intl.formatMessage({
				defaultMessage: "Pending",
				description: "Pending tag: text",
			})}
		</Tag>
	);

	return (
		<div>
			<DealHeader marketplace={marketplace} dealName={deal.name} tag={tag}>
				{isAdmin && (
					<Button onClick={activateDeal}>
						{intl.formatMessage({
							defaultMessage: "Open deal for funding",
							description: "Open for funding button: text",
						})}
					</Button>
				)}
			</DealHeader>
			<DealKeys className="mt-8" dealAddress={deal.address} borrowerKey={deal.borrower} />
			<DealAbstract
				className="mt-10"
				amount={repaymentSchedule.totalPrincipal}
				timeToMaturity={repaymentSchedule.duration}
			/>
			<DealRepaymentSchedule className="mt-16" repaymentSchedule={repaymentSchedule} />
			<DealTrancheStructure
				className="mt-16"
				tranches={tranches}
				principal={repaymentSchedule.totalPrincipal}
			/>
		</div>
	);
};
