import { TrancheSettings } from "@consts";
import { ratioFormatter } from "@utils/format.utils";
import Big, { BigSource } from "big.js";
import React, { FunctionComponent } from "react";

interface TrancheLineProps {
	name: string;
	highlightedElement: string;
	color: string;
	trancheSettings: TrancheSettings;
}

export const TrancheLine: FunctionComponent<TrancheLineProps> = ({
	highlightedElement,
	name,
	color,
	trancheSettings,
}) => {
	const isDeEmphesised = () => {
		return null !== highlightedElement && name !== highlightedElement;
	};

	const getTextClassNames = () => {
		if (highlightedElement === name) {
			return "text-sm font-bold";
		}

		if (!trancheSettings?.percentageOfInterest || isDeEmphesised()) {
			return "text-neutral-35 text-opacity-50";
		}

		return;
	};

	const maybeFormatRatio = (ratio: BigSource) =>
		ratio ? ratioFormatter.format(Big(ratio).div(100).toNumber()) : "/";

	return (
		<>
			<div className={`${getTextClassNames()} flex items-baseline`}>
				<div
					style={{
						backgroundColor:
							trancheSettings?.percentageOfInterest && !isDeEmphesised() ? color : "transparent",
					}}
					className="w-2 h-2 rounded-full mr-2"
				></div>
				<span>{name}</span>
			</div>
			{/* TODO: update input[type=number] with ant design's NumberInput so we don't need to replace the "," */}
			<div className={getTextClassNames()}>
				{maybeFormatRatio(trancheSettings?.percentageOfPrincipal)}
			</div>
			<div className={getTextClassNames()}>
				{maybeFormatRatio(trancheSettings?.percentageOfInterest)}
			</div>
			<div className={getTextClassNames()}>{maybeFormatRatio(trancheSettings?.apr)}</div>
		</>
	);
};
