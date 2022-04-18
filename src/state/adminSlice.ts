import { PublicKey } from "@solana/web3.js";
import base58 from "bs58"
import nacl from "tweetnacl"
import { config } from "../config";
import { StoreSlice } from "./useStore";

const forceUint8Array = (key: Uint8Array | Buffer) => {
	if (key instanceof Uint8Array) {
		return key
	}

	return Uint8Array.from(key)
}

export type AdminSlice = {
	isAdmin?: boolean;
	setIsAdmin: (publicKey: PublicKey) => void;
};

export const createAdminSlice: StoreSlice<AdminSlice> = (set) => ({
	isAdmin: false,
	setIsAdmin: async (publicKey) => {
		if (!publicKey) {
			set({ isAdmin: false });
			return;
		}

		const pubkeyBytes = publicKey.toBytes();
		const hashedPublicKey = nacl.hash(forceUint8Array(pubkeyBytes))

		const isAdmin = config.managementKeys.some(key => {
			const keyBytes = forceUint8Array(base58.decode(key));

			return nacl.verify(hashedPublicKey, keyBytes)
		})

		set({ isAdmin });
	},
});
