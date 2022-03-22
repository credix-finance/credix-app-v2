import React from "react";
import { Icon } from "@components/Icon";

interface InvestmentReturnProps {
	value: number;
	className?: string;
}

export const InvestmentReturn = ({ value, className = "" }: InvestmentReturnProps) => {
	const isGrowth = value >= 0;

	return (
		<div className={`flex items-center space-x-[10px] ${className}`}>
			{isGrowth ? (
				<Icon className="text-action-primary w-6 h-6" name="trend-up-circle" />
			) : (
				<Icon className="text-action-hover w-6 h-6" name="trend-down-circle" />
			)}
			<div className={`${isGrowth ? "text-action-primary" : "text-action-hover"} font-bold`}>
				{isGrowth ? `+${value}` : value}%
			</div>
		</div>
	);
};
