import React, { FunctionComponent, useMemo, useState } from "react";
import { TrancheLine } from "@components/TrancheLine";
import { TrancheDonut } from "@components/TrancheDonut";
import { Icon, IconDimension } from "@components/Icon";
import { trancheColors, TrancheStructure } from "@consts";
import Big from "big.js";

interface TrancheOptionProps {
	trancheStructure: TrancheStructure;
}

export const TrancheOption: FunctionComponent<TrancheOptionProps> = ({ trancheStructure }) => {
	const [highlightedElement, setHighlightedElement] = useState(null);

	const highlightElement = (element) => {
		setHighlightedElement(element.name);
	};

	const unHighlightElement = () => {
		setHighlightedElement(null);
	};

	const donut = useMemo(() => {
		if (!trancheStructure) {
			return null;
		}

		const tranches = [
			{
				name: "Senior",
				pop: trancheStructure.Senior?.percentageOfPrincipal,
			},
			{
				name: "Mezzanine",
				pop: trancheStructure.Mezzanine?.percentageOfPrincipal,
			},
			{
				name: "Junior",
				pop: trancheStructure.Junior?.percentageOfPrincipal,
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
	}, [trancheStructure]);

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
				{Object.entries(trancheStructure).map(([name, structure], index) => (
					<TrancheLine
						key={name}
						name={name}
						structure={structure}
						color={trancheColors[index]}
						highlightedElement={highlightedElement}
					/>
				))}
			</div>
		</div>
	);
};
