import { useWallet } from "@solana/wallet-adapter-react";
import { useCallback, useEffect, useState } from "react";
import React from "react";
import { CredixPass, useCredixClient } from "@credix/credix-client";
import { useRouter } from "next/router";
import { WalletButton } from "./WalletButton";
import { useIntl } from "react-intl";

interface Props {
	children?: React.ReactNode;
}

export const PassGuard = (props: Props) => {
	const router = useRouter();
	const { marketplace } = router.query;
	const client = useCredixClient();
	const wallet = useWallet();
	const [credixPass, setCredixPass] = useState<CredixPass | null | undefined>(undefined);
	const intl = useIntl();

	const isMarketIndexPage = useCallback(() => {
		return router.pathname === "/" || router.pathname.split("/").length === 2;
	}, [router.pathname]);

	const getCredixPass = useCallback(async () => {
		if (wallet.disconnecting) {
			setCredixPass(undefined);
			return;
		}

		if (!wallet.connected && !wallet.connecting) {
			setCredixPass(undefined);
			return;
		}

		if (wallet.connected && wallet.publicKey) {
			const market = await client.fetchMarket(marketplace as string);
			const credixPass = await market?.fetchCredixPass(wallet.publicKey);

			setCredixPass(credixPass);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [wallet.disconnecting, wallet.connected, marketplace]);

	useEffect(() => {
		getCredixPass();
	}, [getCredixPass]);

	let content = (
		<h1 className="text-center">
			{intl.formatMessage({
				defaultMessage: "Checking Credix Pass...",
				description: "PassGuard: credix pass check",
			})}
		</h1>
	);

	if (!wallet.connected && !wallet.connecting) {
		content = (
			<div className="text-center">
				<h1>
					{intl.formatMessage({
						defaultMessage: "Please connect your wallet",
						description: "PassGuard: connect wallet",
					})}
				</h1>
				<div className="flex justify-center">
					<WalletButton />
				</div>
			</div>
		);
	}

	if (null === credixPass) {
		content = (
			<div className="text-center">
				<h1>
					{intl.formatMessage({
						defaultMessage: "No Credix Pass found",
						description: "PassGuard: no credix pass",
					})}
				</h1>
				<div className="flex justify-center">
					<WalletButton />
				</div>
			</div>
		);
	}

	if (credixPass && !credixPass.isActive) {
		content = (
			<div className="text-center">
				<h1>
					{intl.formatMessage({
						defaultMessage: "Credix Pass not active",
						description: "PassGuard: credix pass not active",
					})}
				</h1>
			</div>
		);
	}

	return isMarketIndexPage() || credixPass?.isActive ? (
		<>{props.children}</>
	) : (
		<div className="grid h-screen place-items-center">
			<div className="space-y-4">
				<div className="text-center">
					<div>
						{intl.formatMessage({
							defaultMessage:
								"The Credix Marketplace is now open to accredited investors and fintech lenders.",
							description: "PassGuard: credix access statement",
						})}
					</div>
					<div>
						{intl.formatMessage({
							defaultMessage:
								"You will be able to interact with the protocol if you're whitelisted.",
							description: "PassGuard: credix access statement part two",
						})}
					</div>
				</div>
				{content}
			</div>
		</div>
	);
};
