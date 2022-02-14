import React from "react";
import { Icon, IconNames } from "@components/Icon";

interface TableHeaderCellProps {
	className?: string;
	icon?: IconNames;
	label: string;
}

export const TableHeaderCell = ({ icon, label, className = "" }: TableHeaderCellProps) => {
	return (
		<div className={`space-x-1.5 flex items-center ${className}`}>
			<Icon name={icon} />
			<span>{label}</span>
		</div>
	);
};
