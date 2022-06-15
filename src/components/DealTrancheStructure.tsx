import React, { FunctionComponent } from "react";
import { Icon, IconDimension } from "./Icon";
import { classNames, ratioFormatter } from "@utils/format.utils";
import { Fraction, Tranches } from "@credix/credix-client";
import { trancheColors, trancheNames } from "@consts";
import { TrancheDonut } from "./TrancheDonut";
import { useIntl } from "react-intl";

interface DealTrancheStructureProps {
	className?: string;
	tranches: Tranches;
	principal: number;
}

export const DealTrancheStructure: FunctionComponent<DealTrancheStructureProps> = ({
	className,
	principal,
	tranches,
}) => {
	const intl = useIntl();
	className = classNames([className, "space-y-6"]);
	const trancheData = tranches?.tranches.map((t) => ({
		name: trancheNames[t.index],
		value: new Fraction(t.size.uiAmount, principal).toNumber(),
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
					{tranches && (
						<TrancheDonut
							data={trancheData}
							color={trancheColors}
							onMouseOver={highlightElement}
							onMouseLeave={unHighlightElement}
						/>
					)}
				</div>

				{tranches?.tranches
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
								{tranche.size.uiAmount} USDC -{" "}
								{ratioFormatter.format(new Fraction(tranche.size.uiAmount, principal).toNumber())}
							</div>
							{/* TODO: get tranche APR */}
							<div className="flex items-center font-mono font-bold text-base">5%</div>
							{/* TODO: add border  */}
						</React.Fragment>
					))}
			</div>
		</div>
	);
};
