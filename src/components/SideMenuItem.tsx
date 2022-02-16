import React from "react";
import { Icon, IconNames } from "@components/Icon";
import Link from "next/link";

export interface SideMenuItemProps {
	icon: IconNames;
	label: string;
	path: string;
	isActive: boolean;
}

export const SideMenuItem = ({ label, icon, path, isActive }: SideMenuItemProps) => {
	return (
		<Link href={path} key={label}>
			<a className={`h-[60px] flex items-center ${isActive ? "bg-credix-primary" : "bg-darker"}`}>
				<div
					className={`border-0 h-8 border-l-[3px] border-darker border-solid w-full pl-[23px] flex items-center ${
						isActive ? "text-darker font-bold" : "text-credix-primary font-medium"
					}`}
				>
					<Icon name={icon} className="w-[20px] h-[20px]" />
					<span className="pl-[18px] text-base">{label}</span>
				</div>
			</a>
		</Link>
	);
};
