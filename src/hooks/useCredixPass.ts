import { CredixPass } from "@credix/credix-client";
import { useWallet } from "@solana/wallet-adapter-react";
import { marketSelector } from "@state/selectors";
import { useStore } from "@state/useStore";
import { useEffect } from "react";

let storedCredixPass: CredixPass | null = null;

// TODO: can we memoize or cache or put in the store so it's global?
export const useCredixPass = () => {
	// const [credixPass, setCredixPass] = useState<CredixPass>();
	const market = useStore(marketSelector);

	const wallet = useWallet();

	useEffect(() => {
		const fetchCredixPass = async () => {
			if (!wallet.publicKey) {
				storedCredixPass = null;
				// setCredixPass(undefined);
				return;
			}

			if (!market) {
				storedCredixPass = null;
				// setCredixPass(undefined);
				return;
			}

			const credixPass = await market.fetchCredixPass(wallet.publicKey);
			storedCredixPass = credixPass;
			// setCredixPass(credixPass || undefined);
		};

		fetchCredixPass();
	}, [market, wallet.publicKey]);

	return storedCredixPass;
};
