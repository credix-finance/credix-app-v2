import React, { FunctionComponent } from "react";
import { Icon, IconDimension } from "./Icon";
import { classNames, ratioFormatter, round } from "@utils/format.utils";
import { Fraction } from "@credix/credix-client";
import { trancheColors } from "@consts";
import { TrancheDonut } from "./TrancheDonut";
import { useIntl } from "react-intl";
import { DealWithNestedResources } from "@state/dealSlice";
import Big from "big.js";
import { TrancheName } from "@credix_types/tranche.types";
import { TrancheAPR } from "./TrancheAPR";

interface DealTrancheStructureProps {
	className?: string;
	deal: DealWithNestedResources;
}

export const DealTrancheStructure: FunctionComponent<DealTrancheStructureProps> = ({
	className,
	deal,
}) => {
	const intl = useIntl();
	className = classNames([className, "space-y-6"]);
	const trancheNames = Object.values(TrancheName);
	const trancheData = deal.tranches?.tranches.map((t) => ({
		name: trancheNames[t.index],
		value: new Fraction(t.size.uiAmount, deal.repaymentSchedule.totalPrincipal.uiAmount).toNumber(),
	}));

	// TODO: add highlight logic
	const highlightElement = () => {
		console.log("not implemented yet");
	};
	const unHighlightElement = () => {
		console.log("not implemented yet");
	};

	return (
		<div className={className}>
			<div className="font-sans font-semibold text-3xl">
				{intl.formatMessage({
					defaultMessage: "Tranche structure",
					description: "Deal tranche structure: title",
				})}
			</div>
			<div className="border border-neutral-40 p-10 grid grid-cols-[1fr,1fr,1fr,0.5fr] gap-y-6 gap-x-2 justify-items-end">
				<div></div>
				<div></div>
				<div className="flex items-center space-x-2">
					<Icon name="pie-chart" size={IconDimension.SMALL} />
					<div className="font-mono font-normal text-sm">
						{intl.formatMessage({
							defaultMessage: "Principal",
							description: "Deal tranche structure: principal",
						})}
					</div>
				</div>
				<div className="flex items-center space-x-2">
					<Icon name="trend-up" size={IconDimension.SMALL} />
					<div className="font-mono font-bold text-sm">
						{intl.formatMessage({
							defaultMessage: "APR",
							description: "Deal tranche structure: apr",
						})}
					</div>
				</div>
				<div className="w-48 h-48 rounded-full row-span-3 justify-self-start mr-16">
					{trancheData && (
						<TrancheDonut
							data={trancheData}
							color={trancheColors}
							onMouseOver={highlightElement}
							onMouseLeave={unHighlightElement}
						/>
					)}
				</div>

				{deal.tranches?.tranches
					.filter((t) => t.index > 0)
					.map((tranche, index) => (
						<React.Fragment key={tranche.index}>
							<div className="flex items-center space-x-2 justify-self-start">
								<div
									className="w-6 h-6 rounded-full mr-2"
									style={{ backgroundColor: trancheColors[index] }}
								></div>
								<div className="font-mono font-normal text-base capitalize">
									{trancheNames[tranche.index]}
								</div>
							</div>
							<div className="flex items-center font-mono font-normal text-base">
								{round(tranche.size.uiAmount, Big.roundHalfEven, 0).toString()} USDC -{" "}
								{ratioFormatter.format(
									new Fraction(
										tranche.size.uiAmount,
										deal.repaymentSchedule.totalPrincipal.uiAmount
									).toNumber()
								)}
							</div>
							{/* TODO: get tranche APR */}
							<div className="flex items-center font-mono font-bold text-base">
								<TrancheAPR tranche={tranche} repaymentSchedule={deal.repaymentSchedule} />
							</div>
							{/* TODO: add border  */}
						</React.Fragment>
					))}
			</div>
		</div>
	);
};
