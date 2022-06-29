import { StoreState, useStore } from "@state/useStore";
import { useCallback, useEffect, useState } from "react";

export type AsyncSelector<T> = (state: StoreState) => Promise<T>;

export const useAsyncStore = <T>(selector: AsyncSelector<T>) => {
	const state = useStore();
	const [selection, setSelection] = useState<T | null>(null);

	const select = useCallback(async () => {
		const s = await selector(state);
		setSelection(s);
	}, [selector, state]);

	useEffect(() => {
		select();
	}, [select]);

	return selection;
};
