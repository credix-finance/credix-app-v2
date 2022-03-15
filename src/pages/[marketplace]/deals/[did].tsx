import { Button } from "@components/Button";
import DealDetails from "@components/DealDetails";
import { DealStatus } from "@components/DealStatus";
import { Link } from "@components/Link";
import { Deal as DealType, useCredixClient } from "@credix/credix-client";
import { useStore } from "@state/useStore";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";

const Deal: NextPage = () => {
	const router = useRouter();
	const { marketplace, did } = router.query;
	const client = useCredixClient();
	const { publicKey } = useWallet();
	const [deal, setDeal] = useState<DealType>();
	const isAdmin = useStore((state) => state.isAdmin);

	const getDeal = useCallback(async () => {
		try {
			const market = await client?.fetchMarket(marketplace as string);
			// TODO: get the deal directly from the market once that's added to the client
			const deals = await market?.fetchDeals();
			setDeal(deals.find((deal) => deal.address.toString() === did));
		} catch {
			console.log("failed to fetch market");
		}
	}, [client, marketplace, did]);

	useEffect(() => {
		getDeal();
	}, [getDeal]);

	const activateDeal = async () => {
		try {
			await deal.activate();
			// TODO: trigger success message
		} catch {
			// TODO: trigger error message
		}
	};

	return (
		<div className="px-4 py-5 md:pt-20 max-w-3xl flex flex-col justify-self-center">
			<Link to={`/${marketplace}/deals`} label="Go back to all deals" icon="chevron-left-square" />
			<div className="text-4xl font-sans pt-3 pb-5">{deal?.name}</div>
			<div className="bg-neutral-0 p-12 space-y-7">
				<DealDetails deal={deal} />
				{isAdmin && deal && deal.isPending() && (
					<Button type="default" className="mt-14" onClick={activateDeal}>
						Activate Deal
					</Button>
				)}
			</div>
		</div>
	);
};

export default Deal;
