import React from "react";
import { Slider as AntdSlider } from "antd";
import { SliderSingleProps as AntdSliderSingleProps } from "antd/lib/slider";

interface SliderProps {
	/**
	 * The value of the slider.
	 */
	value: AntdSliderSingleProps["value"];
	/**
	 * Optional message to be displayed when the slider is "full".
	 */
	fullLabel?: string;

	/**
	 * Optional slider max value.
	 */
	max?: AntdSliderSingleProps["max"];
}

export const Slider = ({ value, fullLabel, max = 100, ...props }: SliderProps) => {
	const isFull = value >= max;

	return (
		<div className="flex flex-col">
			<div className="font-semibold">
				{isFull ? <span>{fullLabel}</span> : <span>{value}%</span>}
			</div>
			<div className="block">
				<AntdSlider
					value={value}
					max={max}
					handleStyle={isFull && { display: "none" }}
					{...props}
				/>
			</div>
		</div>
	);
};
