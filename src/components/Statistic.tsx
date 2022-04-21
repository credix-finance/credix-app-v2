import React, { useMemo } from "react";

interface StatisticProps {
	label: string;
	value: number;
	currency?: string;
	isPercentage?: boolean;
}

export const Statistic = ({ label, value, currency, isPercentage = false }: StatisticProps) => {
	const formatter = useMemo(
		() =>
			Intl.NumberFormat("en", {
				style: isPercentage ? "percent" : undefined,
				notation: !isPercentage ? "compact" : undefined,
				minimumFractionDigits: 0,
				maximumFractionDigits: 1,
			}),
		[isPercentage]
	);

	const formattedValue = useMemo(() => {
		return formatter.format(value);
	}, [formatter, value]);

	return (
		<div className="bg-transparent border border-solid border-darker rounded-[1px] font-sans h-36 w-min min-w-[16rem] md:w-full md:min-w-[12rem] ml-[21.5px] pr-5 flex items-center">
			<div className="bg-transparent ml-[-21.5px] relative">
				<div className="left-5 absolute w-3 h-20 z-10 bg-credix-primary"></div>
				<div className="capitalize relative z-20">{label}</div>
				<div className="text-6xl font-bold relative z-20">
					{formattedValue}
					<span className="text-sm font-normal">{currency}</span>
				</div>
			</div>
		</div>
	);
};
