import { Market } from "@credix/credix-client";
import React, { useCallback, useEffect, useState } from "react";
import { formatRatio } from "utils/format.utils";
import { Statistic } from "./Statistic";

interface MarketStatsProps {
	market: Market;
}

export const MarketStats = ({ market }: MarketStatsProps) => {
	const [creditOutstanding, setCreditOutstanding] = useState<number>(0);
	const [tvl, setTvl] = useState<number>(0);
	const [apy, setApy] = useState<number>(0);

	const getTVL = useCallback(async () => {
		const tvl = await market?.calculateTVL();
		setTvl(tvl?.toNumber() || 0);
	}, [market]);

	const getAPY = useCallback(async () => {
		const weightedAverageFinancingFee = await market?.calculateWeightedAverageFinancingFee();

		if (!weightedAverageFinancingFee) {
			return;
		}

		setApy(formatRatio(weightedAverageFinancingFee).div(100).toNumber());
	}, [market]);

	const getCreditOutstanding = useCallback(async () => {
		setCreditOutstanding(market?.totalOutstandingCredit?.toNumber() || 0);
	}, [market]);

	useEffect(() => {
		getTVL();
	}, [getTVL]);

	useEffect(() => {
		getAPY();
	}, [getAPY]);

	useEffect(() => {
		getCreditOutstanding();
	}, [getCreditOutstanding]);

	return (
		<div className="grid grid-cols-1 gap-y-8 md:grid-cols-3 md:gap-x-14 md:gap-y-12">
			<div className="w-full flex justify-center">
				<Statistic label="TVL" currency="USDC" value={tvl} />
			</div>
			<div className="w-full flex justify-center">
				<Statistic label="Estimatded APY" isPercentage={true} value={apy} />
			</div>
			<div className="w-full flex justify-center">
				<Statistic label="Credit outstanding" currency="USDC" value={creditOutstanding} />
			</div>
		</div>
	);
};
