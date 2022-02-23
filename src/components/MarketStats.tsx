import { Market, Ratio } from "@credix/credix-client";
import Big from "big.js";
import React, { useCallback, useEffect, useState } from "react";
import { Statistic } from "./Statistic";

interface MarketStatsProps {
	market: Market;
}

export const MarketStats = ({ market }: MarketStatsProps) => {
	const [creditOutstanding, setCreditOutstanding] = useState<Big | null>(new Big(0));
	const [tvl, setTvl] = useState<Big | null>(new Big(0));
	const [apy, setApy] = useState<Ratio | null>(new Ratio(1, 1));

	const getTVL = useCallback(async () => {
		const tvl = await market?.calculateTVL();
		setTvl(tvl);
	}, [market]);

	const getAPY = useCallback(async () => {
		const weightedAverageFinancingFee = await market?.calculateWeightedAverageFinancingFee();
		setApy(weightedAverageFinancingFee);
	}, [market]);

	const getCreditOutstanding = useCallback(async () => {
		setCreditOutstanding(market?.totalOutstandingCredit);
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
		<>
			<div className="md:col-span-4 w-full flex justify-center">
				<Statistic label="TVL" currency="USDC" value={tvl} />
			</div>
			<div className="md:col-span-4 w-full flex justify-center">
				<Statistic label="Estimatded APY" isPercentage={true} value={apy} />
			</div>
			<div className="md:col-span-4 w-full flex justify-center">
				<Statistic label="Credit outstanding" currency="USDC" value={creditOutstanding} />
			</div>
		</>
	);
};
