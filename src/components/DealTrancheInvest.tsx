import React, { FunctionComponent } from "react";
import { classNames } from "@utils/format.utils";
import { InvestInTranche } from "@components/InvestInTranche";
import { useIntl } from "react-intl";
import { DealWithNestedResources } from "@state/dealSlice";

interface DealTrancheInvestProps {
	className?: string;
	deal: DealWithNestedResources;
}

export const DealTrancheInvest: FunctionComponent<DealTrancheInvestProps> = ({
	className,
	deal,
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
			{deal.tranches?.tranches
				// Remove Senior tranche from array
				.filter((t) => t.index > 1)
				.map((tranche) => (
					<InvestInTranche key={tranche.index} deal={deal} tranche={tranche} />
				))}
		</div>
	);
};
