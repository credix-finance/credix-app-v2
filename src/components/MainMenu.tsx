import React from "react";
import { config } from "../config";
import { SolanaCluster } from "@types/solana.types";
import { CredixLogo } from "@components/CredixLogo";
import { WalletButton } from "@components/WalletButton";
import { Identity } from "@components/Identity";

export const MainMenu = () => {
	return (
		<div className="w-full bg-neutral-0 flex justify-between items-center py-[16.5px] px-4 lg:px-[88px]">
			<div>
				<CredixLogo />
			</div>
			<div className="md:flex">
				{config.clusterConfig.name !== SolanaCluster.LOCALNET && <Identity />}
				<WalletButton className="ml-4" />
			</div>
		</div>
	);
};
