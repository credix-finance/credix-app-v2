import React, { FunctionComponent } from "react";
import { Pie } from "@ant-design/plots";
import { Tranche } from "./TrancheOption";

interface TrancheDonutProps {
	data: Tranche[];
	onMouseOver: (string) => void;
	onMouseLeave: (string) => void;
	color: string[];
}

export const TrancheDonut: FunctionComponent<TrancheDonutProps> = ({
	data,
	onMouseOver,
	onMouseLeave,
	color,
}) => {
	const config = {
		appendPadding: 10,
		data,
		angleField: "value",
		colorField: "type",
		color,
		radius: 1,
		innerRadius: 0.64,
		width: 116,
		height: 116,
		/**
		 * The docs state that you need to set these properties to `false`
		 * in order to disable them, Typescript complains. So we need to
		 * do this ugly casting in order to satisfy Typescript.
		 */
		legend: false as unknown as object,
		label: false as unknown as object,
		statistic: false as unknown as object,
		interactions: [
			{
				// Highlight element on hover
				type: "element-active",
			},
			{
				// Needs to be included in order for the hiding of the label to work
				type: "pie-statistic-active",
			},
		],
	};

	return (
		<Pie
			{...config}
			onReady={(plot) => {
				plot.on("element:mouseenter", (element) => {
					onMouseOver(element.data.data);
				});
				plot.on("element:mouseleave", (element) => {
					onMouseLeave(element.data.data);
				});
			}}
		/>
	);
};
