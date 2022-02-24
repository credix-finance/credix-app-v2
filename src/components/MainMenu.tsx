import React from "react";
import { CredixLogo } from "@components/CredixLogo";
import { WalletButton } from "@components/WalletButton";

export const MainMenu = () => {
	return (
		<div className="w-full bg-neutral-0 flex justify-between items-center py-[16.5px] px-4 lg:px-[88px]">
			<div>
				<CredixLogo />
			</div>
			<div>
				<WalletButton />
			</div>
		</div>
	);
};
