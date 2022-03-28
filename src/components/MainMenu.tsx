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

	return (
		<div className="w-full bg-credix-primary flex justify-between items-center p-4 lg:px-20">
			<div>
				{showLogo && (
					<Link href={`/${router?.query?.marketplace}`}>
						<a>
							<CredixLogo mode="dark" />
						</a>
					</Link>
				)}
			</div>
			<div className="flex">
				{config.clusterConfig.name !== SolanaCluster.LOCALNET && <IdentityButton />}
				<WalletButton className="ml-4" />
			</div>
		</div>
	);
};
