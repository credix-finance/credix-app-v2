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
	const pop = Form.useWatch([trancheTitle, name, "percentageOfPrincipal"], form);
	const poi = Form.useWatch([trancheTitle, name, "percentageOfInterest"], form);
	const apr = Form.useWatch([trancheTitle, name, "apr"], form);

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
			<div className={getTextClassNames()}>
				{pop ? ratioFormatter.format(Big(pop).div(100).toNumber()) : "/"}
			</div>
			<div className={getTextClassNames()}>
				{poi ? ratioFormatter.format(Big(poi).div(100).toNumber()) : "/"}
			</div>
			<div className={getTextClassNames()}>
				{apr ? ratioFormatter.format(Big(apr).div(100).toNumber()) : "/"}
			</div>
		</>
	);
};
