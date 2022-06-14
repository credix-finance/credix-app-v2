import { zeroTokenAmount } from "@consts";
import { useCredixClient } from "@credix/credix-client";
import { useWallet } from "@solana/wallet-adapter-react";
import { TokenAmount } from "@solana/web3.js";
import { useStore } from "@state/useStore";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

export const useUserBaseBalance = () => {
	const router = useRouter();
	const { marketplace } = router.query;
	const client = useCredixClient();
	const { publicKey } = useWallet();
	const maybeFetchMarket = useStore((state) => state.maybeFetchMarket);
	const market = useStore((state) => state.market);
	const [userBaseBalance, setUserBaseBalance] = useState<TokenAmount>(zeroTokenAmount);

	const getUserBaseBalance = useCallback(async () => {
		if (!publicKey) {
			return;
		}

		const userBaseBalance = await market?.userBaseBalance(publicKey);
		setUserBaseBalance(userBaseBalance);
	}, [market, publicKey]);

	useEffect(() => {
		maybeFetchMarket(client, marketplace as string);
	}, [client, maybeFetchMarket, marketplace]);

	useEffect(() => {
		getUserBaseBalance();
	}, [getUserBaseBalance]);

	return userBaseBalance;
};
