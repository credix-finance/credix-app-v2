import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { CredixLogo } from "@components/CredixLogo";
import { SideMenuItem } from "@components/SideMenuItem";
import { Route } from "../types/route.types";

interface SideMenuProps {
	menuItems: Route[];
}

export const SideMenu = ({ menuItems }: SideMenuProps) => {
	const router = useRouter();

	return (
		<div className="w-72 bg-darker h-screen pt-5 sticky top-0">
			<div className="text-credix-primary ml-5 h-[50px] flex">
				<Link href="/">
					<a className="flex items-center">
						<CredixLogo mode="light" />
					</a>
				</Link>
			</div>
			<div className="mt-[145px]">
				{menuItems.map((item) => (
					<SideMenuItem key={item.label} isActive={router?.pathname === item.path} {...item} />
				))}
			</div>
		</div>
	);
};
