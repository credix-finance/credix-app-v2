import { Deal } from "@credix/credix-client";
import { Keypair, PublicKey } from "@solana/web3.js";
import { createAdminSlice } from "@state/adminSlice";
import { createDealSlice, DealSlice } from "@state/dealSlice";
import { createMarketSlice, MarketSlice } from "@state/marketSlice";
import { selectActiveDeals, selectEndedDeals, selectPendingDeals } from "@state/selectors";
import { StoreState } from "@state/useStore";
import { generateMockClient, generateMockMarket } from "@utils/test.utils";
import { UseBoundStore } from "zustand";
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

		const managementKey = new PublicKey("Ej5zJzej7rrUoDngsJ3jcpfuvfVyWpcDcK7uv9cE2LdL");
		state.setIsAdmin(managementKey);

		state = store.getState();
		expect(state.isAdmin).toBeTruthy();
	});

	it("Sets 'isAdmin' to false for public keys that are not management keys", () => {
		let state = store.getState();
		expect(state.isAdmin).toBeFalsy();

		const nonManagementKey = new Keypair().publicKey;
		state.setIsAdmin(nonManagementKey);

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
		const mockClient = generateMockClient();
		const mockMarket = generateMockMarket();

		let state = store.getState();
		expect(state.deals).toBe(null);

		await state.maybeFetchDeals(mockClient, mockMarket);
		state = store.getState();
		expect(state.deals.length).toBe(3);
	});

	it("finds a specific deal based on the deal address", async () => {
		const pk1 = Keypair.generate().publicKey;
		const deal1 = { address: pk1 };
		const mockMarket = generateMockMarket([deal1 as Deal]);
		const mockClient = generateMockClient();

		const state = store.getState();
		const deal = await state.getDeal(mockClient, mockMarket, pk1.toString());
		expect(deal).toEqual(deal1);
	});

	it("fetches deals when using mayBeFetchDeals when deals array is empty", async () => {
		const mockMarket = generateMockMarket();
		const fetchDealsSpy = jest.spyOn(mockMarket, "fetchDeals");
		const mockClient = generateMockClient();

		const state = store.getState();
		await state.maybeFetchDeals(mockClient, mockMarket);
		expect(fetchDealsSpy).toHaveBeenCalled();
	});

	it("Doesn't fetch deals when using mayBeFetchDeals when deals array not empty", async () => {
		const mockMarket = generateMockMarket();
		const mockClient = generateMockClient();

		const state = store.getState();
		await state.maybeFetchDeals(mockClient, mockMarket);

		const fetchDealsSpy = jest.spyOn(mockMarket, "fetchDeals");
		await state.maybeFetchDeals(mockClient, mockMarket);
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
