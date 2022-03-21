import React from "react";
import { Icon, IconName } from "@components/Icon";

export interface TableHeaderCellProps {
	className?: string;
	icon?: IconName;
	label: string;
}

export const TableHeaderCell = ({ icon, label, className = "" }: TableHeaderCellProps) => {
	return (
		<div className={`space-x-1.5 flex items-center ${className}`}>
			<Icon name={icon} size="small" />
			<span>{label}</span>
		</div>
	);
};
