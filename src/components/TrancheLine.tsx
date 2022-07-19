import { TrancheSettings } from "@consts";
import { ratioFormatter } from "@utils/format.utils";
import Big from "big.js";
import React, { FunctionComponent } from "react";

interface TrancheLineProps {
	name: string;
	highlightedElement: string;
	color: string;
	structure: TrancheSettings;
}

export const TrancheLine: FunctionComponent<TrancheLineProps> = ({
	highlightedElement,
	name,
	color,
	structure,
}) => {
	const { percentageOfPrincipal, percentageOfInterest, apr } = structure;
	const isDeEmphesised = () => {
		return null !== highlightedElement && name !== highlightedElement;
	};

	const getTextClassNames = () => {
		if (highlightedElement === name) {
			return "text-sm font-bold";
		}

		if (!percentageOfInterest || isDeEmphesised()) {
			return "text-neutral-35 text-opacity-50";
		}

		return;
	};

	return (
		<>
			<div className={`${getTextClassNames()} flex items-baseline`}>
				<div
					style={{
						backgroundColor: percentageOfInterest && !isDeEmphesised() ? color : "transparent",
					}}
					className="w-2 h-2 rounded-full mr-2"
				></div>
				<span>{name}</span>
			</div>
			<div className={getTextClassNames()}>
				{percentageOfPrincipal
					? ratioFormatter.format(
							Big(percentageOfPrincipal.toString().replace(",", "")).div(100).toNumber()
					  )
					: "/"}
			</div>
			<div className={getTextClassNames()}>
				{percentageOfInterest
					? ratioFormatter.format(
							Big(percentageOfInterest.toString().replace(",", "")).div(100).toNumber()
					  )
					: "/"}
			</div>
			<div className={getTextClassNames()}>
				{" "}
				{apr
					? ratioFormatter.format(Big(apr.toString().replace(",", "")).div(100).toNumber())
					: "/"}
			</div>
		</>
	);
};
