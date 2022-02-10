import React from "react";
import { CredixLogo } from "@components/CredixLogo";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";

export const MainMenu = () => {
	const { wallet } = useWallet();

	return (
		<div className="w-full bg-neutral-0 flex justify-between items-center py-[16.5px] pr-9 pl-[88px]">
			<div>
				<CredixLogo />
			</div>
			<div>
				<WalletMultiButton
					className={`main-menu-button rounded-[1px] border text-shadow-none shadow-none flex items-center
						${
							wallet
								? "bg-transparent text-neutral-100 border-neutral-100 hover:text-neutral-60 hover:border-neutral-60 active:text-neutral-40 active:border-neutral-60 disabled:border-action-disable disabled:text-disabled"
								: "bg-action-primary border-action-primary text-credix-primary hover:bg-neutral-60 hover:border-neutral-60 active:bg-neutral-40 active:border-neutral-40 active:text-neutral-100 disabled:bg-action-disable disabled:border-transparent disabled:text-disabled"
						}`}
				/>
			</div>
		</div>
	);
};
