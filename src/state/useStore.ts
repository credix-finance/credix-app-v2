import create, { SetState, GetState } from "zustand";
import { devtools } from "zustand/middleware";
import { AdminSlice, createAdminSlice } from "./adminSlice";
import { DealSlice, createDealSlice } from "./dealSlice";
import { MarketSlice, createMarketSlice } from "./marketSlice";

export type StoreState = MarketSlice & DealSlice & AdminSlice;

export type StoreSlice<T> = (set: SetState<StoreState>, get: GetState<StoreState>) => T;

export const useStore = create<StoreState>()(
	devtools((set, get) => ({
		...createMarketSlice(set, get),
		...createDealSlice(set, get),
		...createAdminSlice(set, get),
	}))
);
