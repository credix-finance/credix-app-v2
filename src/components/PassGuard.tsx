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

	let content = <h1>Checking Credix Pass...</h1>;

	if (!wallet.connected && !wallet.connecting) {
		content = (
			<div className="text-center">
				<h1>
					{intl.formatMessage({
						defaultMessage: "Please connect your wallet",
						description: "Pass Guard: connect wallet",
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
						description: "Pass Guard: no credix pass",
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
						description: "Pass Guard: credix pass not active",
					})}
				</h1>
			</div>
		);
	}

	return isMarketIndexPage() || credixPass?.isActive ? (
		<>{props.children}</>
	) : (
		<div className="grid h-screen place-items-center">{content}</div>
	);
};
