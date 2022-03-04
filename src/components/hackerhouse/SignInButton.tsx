import { Button } from "@components/Button";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import axios from "axios";
import base58 from "bs58";
import { useCallback, useEffect, useMemo } from "react";

interface Props {
	isLoggedIn: boolean;
	baseUrl: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	callback: any;
}

export const SignInButton = (props: Props) => {
	const { setVisible } = useWalletModal();
	const wallet = useWallet();
	const client = useMemo(() => axios.create({ baseURL: props.baseUrl }), [props.baseUrl]);

	const sign = useCallback(async () => {
		const key = wallet.publicKey;
		const encoder = new TextEncoder();
		const message = key.toString();
		return wallet.signMessage(encoder.encode(message));
	}, [wallet]);

	const logIn = useCallback(async () => {
		const signature = await sign();
		const url = `${props.baseUrl}/login`;
		const payload = {
			address: wallet.publicKey.toString(),
			signature: base58.encode(signature),
		};

		try {
			const response = await client.post(url, payload);
			props.callback(null, response);
		} catch (e) {
			props.callback(e);
		}
	}, [client, sign, wallet.publicKey, props]);

	const click = () => {
		if (!wallet.connected) {
			setVisible(true);
			return;
		}

		if (!props.isLoggedIn) {
			logIn();
		}
	};

	useEffect(() => {
		if (wallet.connected && !wallet.connecting && !props.isLoggedIn) {
			logIn();
		}
	}, [wallet.connected, wallet.connecting, props.isLoggedIn, logIn]);

	return (
		<Button size="large" onClick={click} type="primary">
			Sign in with Solana
		</Button>
	);
};
