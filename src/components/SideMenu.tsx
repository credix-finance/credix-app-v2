import React from "react";
import { SideMenuItem, SideMenuItemProps } from "./SideMenuItem";

interface SideMenuProps {
	menuItems: SideMenuItemProps[];
}

export const SideMenu = ({ menuItems }: SideMenuProps) => {
	return (
		<div className="w-72 bg-darker h-screen pt-[33px]">
			{/* TODO: replace this with CredixIcon component when merged */}
			<div className="w-[39px] h-[39px] text-credix-primary ml-[43px]">CRDX</div>
			<div className="mt-[145px]">
				{menuItems.map((item) => (
					<SideMenuItem key={item.label} {...item} />
				))}
			</div>
		</div>
	);
};
