import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useCallback, useEffect, useState } from "react";
import { Button } from "./Button";

export const SolanaSignInButton = () => {
	const wallet = useWallet();
	const { setVisible } = useWalletModal();
	const [active, setActive] = useState<boolean>(false);

	const onClick = () => {
		if (!wallet.connected) {
			setVisible(true);
		}
	};

	const login = useCallback(async () => {
		const key = wallet.publicKey;
		const encoder = new TextEncoder();
		const message = key.toString();
		const signature = await wallet.signMessage(encoder.encode(message));
	}, [wallet.publicKey]);

	useEffect(() => {
		if (active) {
			if (wallet.connected) {
				login();
			} else {
				setActive(false);
			}
		}
	}, [active]);

	return (
		<Button size="large" onClick={onClick}>
			Sign in with Solana
		</Button>
	);
};
