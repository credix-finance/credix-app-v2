import { ratioFormatter } from "@utils/format.utils";
import { Form } from "antd";
import Big from "big.js";
import React, { FunctionComponent } from "react";

interface TrancheLineProps {
	name: string;
	highlightedElement: string;
	color: string;
	trancheTitle: string;
}

export const TrancheLine: FunctionComponent<TrancheLineProps> = ({
	highlightedElement,
	name,
	color,
	trancheTitle,
}) => {
	const form = Form.useFormInstance();
	const pop = Form.useWatch<string>([trancheTitle, name, "percentageOfPrincipal"], form);
	const poi = Form.useWatch<string>([trancheTitle, name, "percentageOfInterest"], form);
	const apr = Form.useWatch<string>([trancheTitle, name, "apr"], form);

	const isDeEmphesised = () => {
		return null !== highlightedElement && name !== highlightedElement;
	};

	const getTextClassNames = () => {
		if (highlightedElement === name) {
			return "text-sm font-bold";
		}

		if (!poi || isDeEmphesised()) {
			return "text-neutral-35 text-opacity-50";
		}

		return;
	};

	return (
		<>
			<div className={`${getTextClassNames()} flex items-baseline`}>
				<div
					style={{
						backgroundColor: poi && !isDeEmphesised() ? color : "transparent",
					}}
					className="w-2 h-2 rounded-full mr-2"
				></div>
				<span>{name}</span>
			</div>
			{/* TODO: update input[type=number] with ant design's NumberInput so we don't need to replace the "," */}
			<div className={getTextClassNames()}>
				{pop ? ratioFormatter.format(Big(pop.replace(",", "")).div(100).toNumber()) : "/"}
			</div>
			<div className={getTextClassNames()}>
				{poi ? ratioFormatter.format(Big(poi.replace(",", "")).div(100).toNumber()) : "/"}
			</div>
			<div className={getTextClassNames()}>
				{apr ? ratioFormatter.format(Big(apr.replace(",", "")).div(100).toNumber()) : "/"}
			</div>
		</>
	);
};
