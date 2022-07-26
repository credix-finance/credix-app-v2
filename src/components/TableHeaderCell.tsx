import React from "react";
import { Icon, IconDimension, IconName } from "@components/Icon";

export interface TableHeaderCellProps {
	className?: string;
	icon?: IconName;
	iconSize?: IconDimension;
	label: string;
}

export const TableHeaderCell = ({
	icon,
	label,
	className = "",
	iconSize = IconDimension.SMALL,
}: TableHeaderCellProps) => {
	return (
		<div className={`space-x-1 flex items-center ${className}`}>
			<Icon name={icon} size={iconSize} />
			<span>{label}</span>
		</div>
	);
};
