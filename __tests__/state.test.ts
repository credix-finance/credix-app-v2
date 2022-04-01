import { Deal } from "@credix/credix-client";
import { Keypair, PublicKey } from "@solana/web3.js";
import { createAdminSlice } from "@state/adminSlice";
import { createDealSlice, DealSlice } from "@state/dealSlice";
import { createMarketSlice, MarketSlice } from "@state/marketSlice";
import { selectActiveDeals, selectEndedDeals, selectPendingDeals } from "@state/selectors";
import { StoreState } from "@state/useStore";
import { generateMockClient, generateMockMarket } from "@utils/test.utils";
import { UseBoundStore } from "zustand";
import { config } from "../src/config";
import create from "./__mocks__/zustand";

describe("Admin state", () => {
	let store: UseBoundStore<StoreState>;

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
	let store: UseBoundStore<DealSlice>;

	beforeAll(() => {
		store = create((set, get) => {
			return {
				...createDealSlice(set, get),
			};
		});
	});

	it("stores deals in the store", async () => {
		const mockMarket = generateMockMarket();

		let state = store.getState();
		expect(state.deals).toBe(null);

		await state.maybeFetchDeals(mockMarket);
		state = store.getState();
		expect(state.deals.length).toBe(3);
	});

	it("finds a specific deal based on the deal address", async () => {
		const pk1 = Keypair.generate().publicKey;
		const deal1 = { address: pk1 };
		const mockMarket = generateMockMarket([deal1 as Deal]);

		const state = store.getState();
		const deal = await state.getDeal(mockMarket, pk1.toString());
		expect(deal).toEqual(deal1);
	});

	it("fetches deals when using mayBeFetchDeals when deals array is empty", async () => {
		const mockMarket = generateMockMarket();
		const fetchDealsSpy = jest.spyOn(mockMarket, "fetchDeals");

		const state = store.getState();
		await state.maybeFetchDeals(mockMarket);
		expect(fetchDealsSpy).toHaveBeenCalled();
	});

	it("Doesn't fetch deals when using mayBeFetchDeals when deals array not empty", async () => {
		const mockMarket = generateMockMarket();

		const state = store.getState();
		await state.maybeFetchDeals(mockMarket);

		const fetchDealsSpy = jest.spyOn(mockMarket, "fetchDeals");
		await state.maybeFetchDeals(mockMarket);
		expect(fetchDealsSpy).not.toHaveBeenCalled();
	});
});

describe("Market state", () => {
	let store: UseBoundStore<MarketSlice>;

	beforeAll(() => {
		store = create((set, get) => {
			return {
				...createMarketSlice(set, get),
			};
		});
	});

	it("stores market in the store", async () => {
		const marketplace = "testmarket";
		const mockClient = generateMockClient(marketplace);

		let state = store.getState();
		expect(state.market).toBeNull();

		await state.fetchMarket(mockClient, marketplace);
		state = store.getState();

		expect(state.market).not.toBeNull();
	});

	it("fetches market when using mayBeFetchMarket when market is null", async () => {
		const marketplace = "testmarket";
		const mockClient = generateMockClient(marketplace);

		const fetchMarketSpy = jest.spyOn(mockClient, "fetchMarket");
		const state = store.getState();
		await state.maybeFetchMarket(mockClient, marketplace);

		expect(fetchMarketSpy).toHaveBeenCalled();
	});

	it("doesn't fetch market when using mayBeFetchMarket when market is not null", async () => {
		const marketplace = "testmarket";
		const mockClient = generateMockClient(marketplace);

		const state = store.getState();
		await state.fetchMarket(mockClient, marketplace);

		const fetchMarketSpy = jest.spyOn(mockClient, "fetchMarket");
		await state.maybeFetchMarket(mockClient, marketplace);

		expect(fetchMarketSpy).not.toHaveBeenCalled();
	});
});

describe("selectors", () => {
	let store: UseBoundStore<StoreState>;

	beforeAll(() => {
		store = create((set, get) => {
			return {
				...createDealSlice(set, get),
			};
		});
	});

	it("selects active deals", async () => {
		const mockMarket = generateMockMarket();

		let state = store.getState();
		await state.maybeFetchDeals(mockMarket);
		state = store.getState();

		const activeDeals = selectActiveDeals(state);
		expect(activeDeals.length).toBe(1);
	});

	it("selects pending deals", async () => {
		const mockMarket = generateMockMarket();

		let state = store.getState();
		await state.maybeFetchDeals(mockMarket);
		state = store.getState();

		const pendingDeals = selectPendingDeals(state);
		expect(pendingDeals.length).toBe(1);
	});

	it("selects ended deals", async () => {
		const mockMarket = generateMockMarket();

		let state = store.getState();
		await state.maybeFetchDeals(mockMarket);
		state = store.getState();

		const endedDeals = selectEndedDeals(state);
		expect(endedDeals.length).toBe(1);
	});
});
