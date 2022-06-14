import React, { FunctionComponent, useMemo, useState } from "react";
import { TrancheLine } from "@components/TrancheLine";
import { TrancheDonut } from "@components/TrancheDonut";
import { Icon, IconDimension } from "@components/Icon";
import { Tranche } from "@credix_types/tranche.types";
import { trancheColors } from "@consts";

interface TrancheOptionProps {
	trancheData: Tranche[];
}

export const TrancheOption: FunctionComponent<TrancheOptionProps> = ({ trancheData }) => {
	const [highlightedElement, setHighlightedElement] = useState(null);

	const highlightElement = (element) => {
		setHighlightedElement(element.name);
	};

	const unHighlightElement = () => {
		setHighlightedElement(null);
	};

	const donut = useMemo(
		() => (
			<TrancheDonut
				data={trancheData}
				color={trancheColors}
				onMouseOver={highlightElement}
				onMouseLeave={unHighlightElement}
			/>
		),
		[trancheData]
	);

	return (
		<div className="flex space-x-12">
			{donut}
			<div className="grid grid-cols-3 w-1/2 gap-x-12 gap-y-2 text-sm">
				<div className="col-span-1"></div>
				<div className="col-span-1">
					<div className="flex items-center space-x-1">
						<Icon name="trend-up" size={IconDimension.SMALL} />
						<span>Expected APY</span>
					</div>
				</div>
				<div className="col-span-1">
					<div className="flex items-center space-x-1">
						<Icon name="pie-chart" size={IconDimension.SMALL} />
						<span>Size</span>
					</div>
				</div>
				{trancheData.map((tranche, index) => (
					<TrancheLine
						key={tranche.name}
						tranche={tranche}
						color={trancheColors[index]}
						highlightedElement={highlightedElement}
					/>
				))}
			</div>
		</div>
	);
};
