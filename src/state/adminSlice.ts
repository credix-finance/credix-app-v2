import { PublicKey } from "@solana/web3.js";
import base58 from "bs58"
import nacl from "tweetnacl"
import { config } from "../config";
import { StoreSlice } from "./useStore";

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

		const hashedPublicKey = nacl.hash(publicKey.toBytes())

		const isAdmin = config.managementKeys.some(key => {
			return nacl.verify(hashedPublicKey, base58.decode(key))
		})

		set({ isAdmin });
	},
});
