import React, { FunctionComponent } from "react";
import { Icon, IconDimension } from "./Icon";
import { classNames, compactFormatter } from "@utils/format.utils";
import { useIntl } from "react-intl";
import { DealWithNestedResources } from "@state/dealSlice";

interface DealAbstractProps {
	deal: DealWithNestedResources;
	className?: string;
}

export const DealAbstract: FunctionComponent<DealAbstractProps> = ({ deal, className }) => {
	const intl = useIntl();
	className = classNames([className, "grid grid-cols-3 gap-2"]);

	return (
		<div className={className}>
			<div className="border border-neutral-40 px-6 pt-6 col-span-2 space-y-2">
				<div className="flex space-x-2">
					<Icon name="coin-dollar" size={IconDimension.MIDDLE} />
					<div className="font-mono font-medium text-base">
						{intl.formatMessage({
							defaultMessage: "Total deal amount",
							description: "Deal abstract: total deal amount",
						})}
					</div>
				</div>
				<div className="font-mono font-bold text-[44px]">
					{compactFormatter.format(deal.repaymentSchedule.totalPrincipal.uiAmount)} USDC
				</div>
			</div>
			<div className="border border-neutral-40 p-6 col-span-1 space-y-2">
				<div className="font-mono font-medium text-base">
					{intl.formatMessage({
						defaultMessage: "Time to maturity",
						description: "Deal abstract: time to maturity",
					})}
				</div>
				<div className="font-mono font-bold text-2xl">{deal.repaymentSchedule.duration} DAYS</div>
			</div>
		</div>
	);
};
