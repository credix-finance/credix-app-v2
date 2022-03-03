import React, { useCallback, useEffect, useState } from "react";
import { InvestWithdraw as InvestWithdrawComponent } from "@components/InvestWithdraw";
import { Market, useCredixClient } from "@credix/credix-client";
import { defaultMarketplace } from "consts";
import { MarketStats } from "@components/MarketStats";

function InvestWithdraw() {
	const client = useCredixClient();
	const [market, setMarket] = useState<Market>();

	const getMarket = useCallback(async () => {
		const market = await client.fetchMarket(defaultMarketplace);
		setMarket(market);
	}, [client]);

	useEffect(() => {
		getMarket();
	}, []);

	return (
		<div className="space-y-20 py-5 px-4 md:pt-24 md:px-32">
			<div className="md:-ml-[22px]">
				<MarketStats market={market} />
			</div>
			<InvestWithdrawComponent />
		</div>
	);
}

export default InvestWithdraw;
