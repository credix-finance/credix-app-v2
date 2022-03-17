import DealForm, { DealFormInput } from "@components/DealForm";
import { Link } from "@components/Link";
import { useCredixClient } from "@credix/credix-client";
import { PublicKey } from "@solana/web3.js";
import Big from "big.js";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useStore } from "state/useStore";

const New: NextPage = () => {
	const router = useRouter();
	const { marketplace } = router.query;
	const client = useCredixClient();
	const fetchMarket = useStore((state) => state.fetchMarket);
	const market = useStore((state) => state.market);

	useEffect(() => {
		fetchMarket(client, marketplace as string);
	}, [client, fetchMarket, marketplace]);

	const onSubmit = async ({
		principal,
		financingFee,
		timeToMaturity,
		borrower,
		dealName,
	}: DealFormInput) => {
		try {
			const borrowerPK = new PublicKey(borrower);
			const principalBN = new Big(principal);
			const dealAddress = await market.createDeal(
				principalBN,
				financingFee,
				timeToMaturity,
				borrowerPK,
				dealName
			);
			// TODO: trigger success message
			router.push(`/deals/${dealAddress}`);
		} catch (e) {
			// TODO: trigger error message
			console.log(e);
		}
	};

	return (
		<div>
			<Link to={`/${marketplace}/deals`} label="Go back to all deals" icon="chevron-left-square" />
			<div className="text-4xl font-sans pt-3 pb-5">New Deal</div>
			<div className="bg-neutral-0 py-10 px-24 space-y-7">
				<DealForm onSubmit={onSubmit} />
			</div>
		</div>
	);
};

export default New;
