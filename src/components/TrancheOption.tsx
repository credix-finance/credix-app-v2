import React, { FunctionComponent, useMemo, useState } from "react";
import { TrancheLine } from "@components/TrancheLine";
import { TrancheDonut } from "@components/TrancheDonut";
import { Icon, IconDimension } from "@components/Icon";
import { trancheColors, TrancheStructure } from "@consts";
import Big from "big.js";
import { defineMessages, useIntl } from "react-intl";

interface TrancheOptionProps {
	trancheStructure: TrancheStructure;
}

export const TrancheOption: FunctionComponent<TrancheOptionProps> = ({ trancheStructure }) => {
	const intl = useIntl();
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
						<span>{intl.formatMessage(MESSAGES.principal)}</span>
					</div>
				</div>
				<div className="col-span-1">
					<div className="flex items-center space-x-1">
						<Icon name="pie-chart" size={IconDimension.SMALL} />
						<span>{intl.formatMessage(MESSAGES.interest)}</span>
					</div>
				</div>
				<div className="col-span-1">
					<div className="flex items-center space-x-1">
						<Icon name="trend-up" size={IconDimension.SMALL} />
						<span>{intl.formatMessage(MESSAGES.expectedAPY)}</span>
					</div>
				</div>
				{Object.entries(trancheStructure).map(([name, structure], index) => (
					<TrancheLine
						key={name}
						name={name}
						trancheSettings={structure}
						color={trancheColors[index]}
						highlightedElement={highlightedElement}
					/>
				))}
			</div>
		</div>
	);
};

const MESSAGES = defineMessages({
	principal: {
		defaultMessage: "Principal",
		description: "Tranche option: principal",
	},
	interest: {
		defaultMessage: "Interest",
		description: "Tranche option: interest",
	},
	expectedAPY: {
		defaultMessage: "Expected APY",
		description: "Tranche option: expected APY",
	},
});
