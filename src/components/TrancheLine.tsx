import { TrancheDataElement } from "@consts";
import { Fraction } from "@credix/credix-client";
import { ratioFormatter } from "@utils/format.utils";
import { Form } from "antd";
import Big from "big.js";
import React, { FunctionComponent } from "react";

interface TrancheLineProps {
	name: string;
	highlightedElement: string;
	color: string;
	apr: TrancheDataElement["apr"];
	value: number;
	percentageOfPrincipal: TrancheDataElement["percentageOfPrincipal"];
	percentageOfInterest: TrancheDataElement["percentageOfInterest"];
}

export const TrancheLine: FunctionComponent<TrancheLineProps> = ({
	highlightedElement,
	name,
	value,
	color,
	apr,
	percentageOfPrincipal,
	percentageOfInterest,
}) => {
	const isDeEmphesised = () => {
		return null !== highlightedElement && name !== highlightedElement;
	};

	const getTextClassNames = () => {
		if (highlightedElement === name) {
			return "text-sm font-bold";
		}

		if (!percentageOfPrincipal || isDeEmphesised()) {
			return "text-neutral-35 text-opacity-50";
		}

		return;
	};

	return (
		<>
			<div className={`${getTextClassNames()} flex items-baseline`}>
				<div
					style={{
						backgroundColor: percentageOfPrincipal && !isDeEmphesised() ? color : "transparent",
					}}
					className="w-2 h-2 rounded-full mr-2"
				></div>
				<span>{name}</span>
			</div>
			<div className={getTextClassNames()}>
				{percentageOfPrincipal
					? ratioFormatter.format(Big(percentageOfPrincipal).div(100).toNumber())
					: "/"}
			</div>
			<div className={getTextClassNames()}>
				{percentageOfInterest
					? ratioFormatter.format(Big(percentageOfInterest).div(100).toNumber())
					: "/"}
			</div>
			<div className={getTextClassNames()}>
				{apr ? ratioFormatter.format(Big(apr).div(100).toNumber()) : "/"}
			</div>
		</>
	);
};
