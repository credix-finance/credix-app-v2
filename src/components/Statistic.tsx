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
		<div className="bg-credix-primary border border-solid border-darker rounded-[1px] font-sans h-36 w-min min-w-[16rem] md:w-full md:min-w-[12rem] ml-[21.5px] pr-5 flex items-center">
			<div className="bg-credix-primary ml-[-21.5px]">
				<div className="capitalize">{label}</div>
				<div className="text-6xl font-bold">
					{formattedValue}
					<span className="text-sm font-normal">{currency}</span>
				</div>
			</div>
		</div>
	);
};
