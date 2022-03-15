import create, { SetState, GetState } from "zustand";
import { devtools } from "zustand/middleware";
import { MarketSlice, createMarketSlice } from "./marketSlice";

export type StoreState = MarketSlice;

export type StoreSlice<T> = (set: SetState<StoreState>, get: GetState<StoreState>) => T;

export const useStore = create<StoreState>(
	devtools((set, get) => ({
		...createMarketSlice(set, get),
	}))
);
