import { useRouter } from "next/router"
import React from "react";
import { CredixLogo } from "./CredixLogo"
import { SideMenuItem, SideMenuItemProps } from "./SideMenuItem";

interface SideMenuProps {
	menuItems: Omit<SideMenuItemProps, "isActive">[];
}

export const SideMenu = ({ menuItems }: SideMenuProps) => {
	const router = useRouter();

	return (
		<div className="w-72 bg-darker h-screen pt-[33px] sticky top-0">
			<div className="w-[39px] h-[39px] text-credix-primary ml-[43px]">
				<CredixLogo mode="light" />
			</div>
			<div className="mt-[145px]">
				{menuItems.map((item) => (
					<SideMenuItem key={item.label} isActive={router.pathname === item.path} {...item} />
				))}
			</div>
		</div>
	);
};
