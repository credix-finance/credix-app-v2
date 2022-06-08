import { Tranche } from "@credix_types/tranche.types";
import { ratioFormatter } from "@utils/format.utils";
import React, { FunctionComponent } from "react";

interface TrancheLineProps {
	tranche: Tranche;
	highlightedElement: string;
	color: string;
}

export const TrancheLine: FunctionComponent<TrancheLineProps> = ({
	tranche,
	highlightedElement,
	color,
}) => {
	const { name, value, expectedApy } = tranche;

	const isDeEmphesised = () => {
		return null !== highlightedElement && name !== highlightedElement;
	};

	const getTextClassNames = () => {
		if (highlightedElement === name) {
			return "text-sm font-bold";
		}

		if (!value || isDeEmphesised()) {
			return "text-neutral-35 text-opacity-50";
		}

		return;
	};

	return (
		<>
			<div className={`${getTextClassNames()} flex items-baseline`}>
				<div
					style={{ backgroundColor: value && !isDeEmphesised() ? color : "transparent" }}
					className="w-2 h-2 rounded-full mr-2"
				></div>
				<span>{name}</span>
			</div>
			<div className={getTextClassNames()}>
				{expectedApy ? ratioFormatter.format(expectedApy) : "/"}
			</div>
			<div className={getTextClassNames()}>{value ? ratioFormatter.format(value) : "/"}</div>
		</>
	);
};
