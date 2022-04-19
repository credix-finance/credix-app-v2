import { PublicKey } from "@solana/web3.js";
import { verifyEncodedKey } from "@utils/hash.utils";
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

		const isAdmin = config.managementKeys.some((key) => verifyEncodedKey(publicKey, key));

		set({ isAdmin });
	},
});
