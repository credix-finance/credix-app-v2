import React from "react";
import NextLink from "next/link";
import { Icon, IconNames } from "./Icon";

interface LinkProps {
	label?: string;
	icon?: IconNames;
	to: string;
	as?: string;
}

export const Link = ({ label, icon, as, to, ...props }: LinkProps) => {
	return (
		<NextLink href={to} as={as}>
			<a className="no-underline font-bold text-inherit text-base" {...props}>
				<div className="flex items-center space-x-3">
					<Icon name={icon} className="w-[18px] h-[18px]" />
					<div>{label}</div>
				</div>
			</a>
		</NextLink>
	);
};
