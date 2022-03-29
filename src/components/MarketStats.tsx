import { Market } from "@credix/credix-client";
import Big from "big.js";
import React, { useCallback, useEffect, useState } from "react";
import { toUIAmount } from "utils/format.utils";
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

		if (tvl) {
			setTvl(toUIAmount(tvl).toNumber() || 0);
		}
	}, [market]);

	const getAPY = useCallback(async () => {
		const weightedAverageFinancingFee = await market?.calculateWeightedAverageFinancingFee();

		if (!weightedAverageFinancingFee) {
			return;
		}

		setApy(weightedAverageFinancingFee.apply(new Big(1)).toNumber());
	}, [market]);

	const getCreditOutstanding = useCallback(async () => {
		const totalOutstandingCredit = market?.totalOutstandingCredit;

		if (totalOutstandingCredit) {
			setCreditOutstanding(toUIAmount(totalOutstandingCredit).toNumber());
		}
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
				<Statistic label="Average financing fee" isPercentage={true} value={apy} />
			</div>
			<div className="w-full flex justify-center">
				<Statistic label="Credit outstanding" currency="USDC" value={creditOutstanding} />
			</div>
		</div>
	);
};
