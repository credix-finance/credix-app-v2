import React from "react";
import NextLink from "next/link";
import { Icon, IconName } from "./Icon";

interface LinkProps {
	label?: string;
	icon?: IconName;
	to: string;
	as?: string;
	className?: string;
}

export const Link = ({ label, icon, as, to, className = "", ...props }: LinkProps) => {
	return (
		<NextLink href={to} as={as}>
			<a className={`no-underline font-bold text-inherit text-base ${className}`} {...props}>
				<div className="flex items-center space-x-3">
					<Icon name={icon} className="w-[18px] h-[18px]" />
					<div>{label}</div>
				</div>
			</a>
		</NextLink>
	);
};
