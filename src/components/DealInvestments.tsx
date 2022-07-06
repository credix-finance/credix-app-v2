import React, { FunctionComponent } from "react";
import { classNames } from "@utils/format.utils";
import { useIntl } from "react-intl";
import { TrancheInvestment } from "./TrancheInvestment";
import { DealWithNestedResources } from "@state/dealSlice";

interface DealInvestmentsProps {
	className?: string;
	deal: DealWithNestedResources;
}

export const DealInvestments: FunctionComponent<DealInvestmentsProps> = ({ className, deal }) => {
	const intl = useIntl();
	className = classNames([className, "space-y-6"]);

	return (
		<div className={className}>
			<div className="font-sans font-semibold text-3xl">
				{intl.formatMessage({
					defaultMessage: "Your investments",
					description: "Deal investments: title",
				})}
			</div>
			{deal.tranches?.tranches
				// Remove Senior tranche from array
				.filter((t) => t.index > 1)
				.map((tranche) => (
					<TrancheInvestment key={tranche.index} tranche={tranche} deal={deal} />
				))}
		</div>
	);
};
