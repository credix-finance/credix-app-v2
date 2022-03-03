import { Button } from "@components/Button";
import { useWallet, WalletContextState } from "@solana/wallet-adapter-react";
import axios from "axios";
import base58 from "bs58";
import type { NextPage } from "next";
import { useEffect, useMemo, useState } from "react";
import create from "zustand";
import { persist } from "zustand/middleware";

const useStore = create(
	persist(
		(set) => ({
			token: undefined,
			setToken: (t: string) => set({ token: t }),
		}),
		{
			name: "storage",
		}
	)
);

const Overview: NextPage = () => {
	const wallet = useWallet();
	const [walletMessage, setWalletMessage] = useState<string>("Connect your wallet");
	const token = useStore((state) => state.token);
	const setToken = useStore((state) => state.setToken);

	const client = useMemo(
		() =>
			axios.create({
				baseURL: "http://127.0.0.1:8080",
				headers: { Authorization: token ? `Bearer ${token}` : undefined },
			}),
		[token]
	);

	const login = async (wallet: WalletContextState) => {
		if (!wallet.connected) {
			return;
		}

		const key = wallet.publicKey;
		const encoder = new TextEncoder();
		const message = key.toString();
		const signature = await wallet.signMessage(encoder.encode(message));
		const response = await client.post("/login", {
			address: message,
			signature: base58.encode(signature),
		});

		const token = response.data.access_token;

		// client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
		setToken(token);
	};

	const getMe = async () => {
		const response = await client.get("/api/users/me");
		console.log(response.data);
	};

	useEffect(() => {
		setWalletMessage(!wallet.connected ? "Connect your wallet" : "Sign in with Solana");
	}, [wallet.connected]);

	const onSignin = async () => {
		await login(wallet);
		// await getMe();
	};

	return (
		<main
			id="index"
			className="grid grid-cols-1 grid-auto-rows-min gap-y-8 md:grid-cols-12 md:gap-y-12 md:gap-x-14 justify-items-center p-4 pt-8 md:p-8 lg:pt-16 lg:max-w-6xl lg:justify-self-center"
		>
			<div className="text-center md:col-span-12 md:max-w-3xl grid justify-items-center">
				<h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold font-sans">
					Hackerhouse Prague
				</h1>
				<Button onClick={onSignin} disabled={!wallet.connected}>
					{walletMessage}
				</Button>
				<Button onClick={getMe}>get info</Button>
			</div>
		</main>
	);
};

export default Overview;
