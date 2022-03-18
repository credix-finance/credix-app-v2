import React from "react";
import { config } from "../config";
import { SolanaCluster } from "@credix_types/solana.types";
import { CredixLogo } from "@components/CredixLogo";
import { WalletButton } from "@components/WalletButton";
import { IdentityButton } from "@components/IdentityButton";

export const MainMenu = () => {
	return (
		<div className="w-full bg-credix-primary flex justify-between items-center py-[16.5px] px-4 lg:px-[88px]">
			<div>
				<CredixLogo />
			</div>
			<div className="md:flex">
				{config.clusterConfig.name !== SolanaCluster.LOCALNET && <IdentityButton />}
				<WalletButton className="ml-4" />
			</div>
		</div>
	);
};
