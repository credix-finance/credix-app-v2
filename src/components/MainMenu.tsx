import React from "react";
import { CredixLogo } from "@components/CredixLogo";
import { WalletButton } from "@components/WalletButton";
import { SolanaSignInButton } from "./SSIButton";

export const MainMenu = () => {
	return (
		<div className="w-full bg-neutral-0 flex justify-between items-center py-[16.5px] px-4">
			<div>
				<CredixLogo />
			</div>
			<div className="flex space-x-4">
				<WalletButton />
				<SolanaSignInButton />
			</div>
		</div>
	);
};
