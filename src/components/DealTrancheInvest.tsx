import React, { FunctionComponent } from "react";
import { classNames } from "@utils/format.utils";
import { RepaymentSchedule, Tranches } from "@credix/credix-client";
import { InvestInTranche } from "@components/InvestInTranche";
import { useIntl } from "react-intl";

interface DealTrancheInvestProps {
	className?: string;
	tranches: Tranches;
	repaymentSchedule: RepaymentSchedule;
}

export const DealTrancheInvest: FunctionComponent<DealTrancheInvestProps> = ({
	className,
	tranches,
	repaymentSchedule,
}) => {
	const intl = useIntl();
	className = classNames([className, "space-y-6"]);

	return (
		<div className={className}>
			<div className="font-sans font-semibold text-3xl">
				{intl.formatMessage({
					defaultMessage: "Invest in tranches",
					description: "Deal tranche invest: title",
				})}
			</div>
			{tranches?.tranches
				// Remove Senior tranche from array
				.filter((t) => t.index > 1)
				.map((tranche) => (
					<InvestInTranche
						key={tranche.index}
						tranche={tranche}
						repaymentSchedule={repaymentSchedule}
					/>
				))}
		</div>
	);
};
