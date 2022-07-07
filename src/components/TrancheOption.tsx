import React, { FunctionComponent, useMemo, useState } from "react";
import { TrancheLine } from "@components/TrancheLine";
import { TrancheDonut } from "@components/TrancheDonut";
import { Icon, IconDimension } from "@components/Icon";
import { DefaultTranche, trancheColors, TrancheDataElement } from "@consts";
import Big from "big.js";
import { Form } from "antd";

interface TrancheOptionProps {
	trancheData: TrancheDataElement[];
	trancheStructure: DefaultTranche["title"];
}

export const TrancheOption: FunctionComponent<TrancheOptionProps> = ({
	trancheData,
	trancheStructure,
}) => {
	const [highlightedElement, setHighlightedElement] = useState(null);
	const form = Form.useFormInstance();
	const popSr = Form.useWatch([trancheStructure, "Senior", "percentageOfPrincipal"], form);
	const popMz = Form.useWatch([trancheStructure, "Mezzanine", "percentageOfPrincipal"], form);
	const popJr = Form.useWatch([trancheStructure, "Junior", "percentageOfPrincipal"], form);

	const highlightElement = (element) => {
		setHighlightedElement(element.name);
	};

	const unHighlightElement = () => {
		setHighlightedElement(null);
	};

	const donut = useMemo(() => {
		const tranches = [
			{
				name: "Senior",
				pop: popSr,
			},
			{
				name: "Mezzanine",
				pop: popMz,
			},
			{
				name: "Junior",
				pop: popJr,
			},
		];
		return (
			<TrancheDonut
				data={tranches
					.filter((t) => t.pop !== undefined)
					.map((t) => ({
						name: t.name,
						value: t.pop ? Big(t.pop).toNumber() : null,
					}))}
				color={trancheColors}
				onMouseOver={highlightElement}
				onMouseLeave={unHighlightElement}
			/>
		);
	}, [trancheStructure, popSr, popMz, popJr]);

	return (
		<div className="flex space-x-12">
			{donut}
			<div className="grid grid-cols-4 w-1/2 gap-x-12 gap-y-2 text-sm">
				<div className="col-span-1"></div>
				<div className="col-span-1">
					<div className="flex items-center space-x-1">
						<Icon name="pie-chart" size={IconDimension.SMALL} />
						<span>Principal</span>
					</div>
				</div>
				<div className="col-span-1">
					<div className="flex items-center space-x-1">
						<Icon name="pie-chart" size={IconDimension.SMALL} />
						<span>Interest</span>
					</div>
				</div>
				<div className="col-span-1">
					<div className="flex items-center space-x-1">
						<Icon name="trend-up" size={IconDimension.SMALL} />
						<span>Expected APY</span>
					</div>
				</div>
				{trancheData.map((tranche, index) => (
					<TrancheLine
						key={tranche.name}
						name={tranche.name}
						apr={tranche.apr}
						trancheTitle={trancheStructure}
						percentageOfPrincipal={tranche.percentageOfPrincipal}
						percentageOfInterest={tranche.percentageOfInterest}
						color={trancheColors[index]}
						highlightedElement={highlightedElement}
					/>
				))}
			</div>
		</div>
	);
};
