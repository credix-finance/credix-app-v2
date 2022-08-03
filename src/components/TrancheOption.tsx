import React, { FunctionComponent, useMemo, useState } from "react";
import { TrancheLine } from "@components/TrancheLine";
import { TrancheDonut } from "@components/TrancheDonut";
import { Icon, IconDimension } from "@components/Icon";
import { trancheColors, TrancheSettings } from "@consts";
import Big from "big.js";
import { TrancheName } from "@credix_types/tranche.types";
import { defineMessages, useIntl } from "react-intl";

interface TrancheOptionProps {
	juniorTrancheSettings?: TrancheSettings;
	mezzanineTrancheSettings?: TrancheSettings;
	seniorTrancheSettings?: TrancheSettings;
}

export const TrancheOption: FunctionComponent<TrancheOptionProps> = ({
	juniorTrancheSettings,
	mezzanineTrancheSettings,
	seniorTrancheSettings,
}) => {
	const intl = useIntl();
	const [highlightedElement, setHighlightedElement] = useState(null);
	const tranches = {
		[TrancheName.Senior]: seniorTrancheSettings,
		[TrancheName.Mezzanine]: mezzanineTrancheSettings,
		[TrancheName.Junior]: juniorTrancheSettings,
	};

	const highlightElement = (element) => {
		setHighlightedElement(element.name);
	};

	const unHighlightElement = () => {
		setHighlightedElement(null);
	};

	const donut = useMemo(() => {
		if (!juniorTrancheSettings && !mezzanineTrancheSettings && !seniorTrancheSettings) {
			return null;
		}

		const tranches = [
			{
				name: TrancheName.Senior,
				pop: seniorTrancheSettings?.percentageOfPrincipal,
			},
			{
				name: TrancheName.Mezzanine,
				pop: mezzanineTrancheSettings?.percentageOfPrincipal,
			},
			{
				name: TrancheName.Junior,
				pop: juniorTrancheSettings?.percentageOfPrincipal,
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
	}, [juniorTrancheSettings, mezzanineTrancheSettings, seniorTrancheSettings]);

	return (
		<div className="flex space-x-12">
			{donut}
			<div className="grid grid-cols-3 w-1/2 gap-x-12 gap-y-2 text-sm">
				<div className="col-span-1"></div>
				<div className="col-span-1">
					<div className="flex items-center space-x-1">
						<Icon name="pie-chart" size={IconDimension.SMALL} />
						<span>{intl.formatMessage(MESSAGES.principal)}</span>
					</div>
				</div>
				<div className="col-span-1">
					<div className="flex items-center space-x-1">
						<Icon name="trend-up" size={IconDimension.SMALL} />
						<span>{intl.formatMessage(MESSAGES.expectedAPR)}</span>
					</div>
				</div>
				{Object.entries(tranches).map(([name, settings], index) => (
					<TrancheLine
						key={name}
						name={name}
						trancheSettings={settings}
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
	expectedAPR: {
		defaultMessage: "Expected APR",
		description: "Tranche option: expected APR",
	},
});
