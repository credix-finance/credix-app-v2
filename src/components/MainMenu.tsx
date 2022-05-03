import React from "react";
import { config } from "../config";
import { SolanaCluster } from "@credix_types/solana.types";
import { CredixLogo } from "@components/CredixLogo";
import { WalletButton } from "@components/WalletButton";
import { IdentityButton } from "@components/IdentityButton";
import Link from "next/link";
import { useRouter } from "next/router";

interface MainMenuProps {
	showLogo?: boolean;
}

export const MainMenu = ({ showLogo = true }: MainMenuProps) => {
	const router = useRouter();

	const path = (router?.query?.marketplace as string) || "/";

	return (
		<div className="w-full bg-credix-primary flex justify-between items-center py-4 px-20">
			<div>
				{showLogo && (
					<Link href={path}>
						<a className="flex items-center">
							<CredixLogo mode="dark" />
						</a>
					</Link>
				)}
			</div>
			<div className="flex items-center space-x-12">
				{config.clusterConfig.name !== SolanaCluster.LOCALNET && <IdentityButton />}
				<WalletButton />
			</div>
		</div>
	);
};
