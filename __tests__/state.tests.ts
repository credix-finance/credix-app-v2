import { PublicKey } from "@solana/web3.js";
import { createAdminSlice } from "@state/adminSlice";
import { config } from "../src/config";
import create from "./__mocks__/zustand";

describe("Admin state", () => {
	let store;

	beforeAll(() => {
		store = create((set, get) => {
			return {
				...createAdminSlice(set, get),
			};
		});
	});

	it("Sets 'isAdmin' to true for management public keys", () => {
		let state = store.getState();
		expect(state.isAdmin).toBeFalsy();

		const managementKey = new PublicKey(config.managementKeys[0]);
		state.setIsAdmin(managementKey);

		state = store.getState();
		expect(state.isAdmin).toBeTruthy();
	});

	it("Sets 'isAdmin' to false for public keys that are not management keys", () => {
		let state = store.getState();
		expect(state.isAdmin).toBeFalsy();

		const managementKey = new PublicKey("CRDx2YkdtYtGZXGHZ59wNv1EwKHQndnRc1gT4p8i2vPX");
		state.setIsAdmin(managementKey);

		state = store.getState();
		expect(state.isAdmin).toBeFalsy();
	});
});

describe("Deals state", () => {
	it.todo("stores deals in the store");
});

describe("Market state", () => {
	it.todo("stores market in the store");
	it.todo("doesn't refetch market when using maybeFetchMarket");
});
