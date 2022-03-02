import { WalletContextState } from "@solana/wallet-adapter-react";
import axios from "axios";
import base58 from "bs58";

const token = window.localStorage.getItem("token");
const backendClient = axios.create({
	baseURL: "http://127.0.0.1:8080",
	headers: { Authorization: `Bearer ${token}` },
});

export const login = async (wallet: WalletContextState) => {
	if (!wallet.connected) {
		return;
	}

	const key = wallet.publicKey;
	const encoder = new TextEncoder();
	const message = key.toString();
	const signature = await wallet.signMessage(encoder.encode(message));
	const response = await backendClient.post("/login", {
		address: message,
		signature: base58.encode(signature),
	});

	const token = response.data.access_token;

	backendClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
	window.localStorage.setItem("token", token);
	console.log("asdf");
};

export const getMe = async () => {
	const response = await backendClient.get("/api/users/me");
	console.log(response.data);
};
