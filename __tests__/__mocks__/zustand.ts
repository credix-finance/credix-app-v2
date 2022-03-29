/**
 * Source: https://docs.pmnd.rs/zustand/testing (28/03/2022)
 */

import actualCreate from "zustand";
import { act } from "react-dom/test-utils";
import { StoreState } from "@state/useStore";

let reset: () => void;

// when creating a store, we get its initial state and create a reset function
const create = (createState) => {
	const store = actualCreate<StoreState>(createState);
	const initialState = store.getState();
	reset = () => store.setState(initialState, true);
	return store;
};

// Reset store after each test run
afterEach(() => {
	act(() => reset());
});

export default create;
