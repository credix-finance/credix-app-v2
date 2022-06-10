import { Market } from "@credix/credix-client";
import Big from "big.js";
import React, { useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { toUIAmount } from "utils/format.utils";
import { Statistic } from "./Statistic";

interface MarketStatsProps {
	market: Market;
}

export const MarketStats = ({ market }: MarketStatsProps) => {
	const [creditOutstanding, setCreditOutstanding] = useState<number>(0);
	const [tvl, setTvl] = useState<number>(0);
	const intl = useIntl();

	const getTVL = useCallback(async () => {
		const tvl = await market?.calculateTVL();

		if (tvl) {
			setTvl(toUIAmount(new Big(tvl)).toNumber() || 0);
		}
	}, [market]);

	const getCreditOutstanding = useCallback(async () => {
		const totalOutstandingCredit = market?.totalOutstandingCredit;

		if (totalOutstandingCredit) {
			setCreditOutstanding(toUIAmount(new Big(totalOutstandingCredit)).toNumber());
		}
	}, [market]);

	useEffect(() => {
		getTVL();
	}, [getTVL]);

	useEffect(() => {
		getCreditOutstanding();
	}, [getCreditOutstanding]);

	return (
		<div className="grid grid-cols-1 gap-y-8 md:grid-cols-3 md:gap-x-14 md:gap-y-12">
			<div className="w-full flex justify-center">
				<Statistic
					label={intl.formatMessage({
						defaultMessage: "TVL",
						description: "MarketStats: total value locked",
					})}
					currency="USDC"
					value={tvl}
				/>
			</div>
			<div className="w-full flex justify-center">
				<Statistic
					label={intl.formatMessage({
						defaultMessage: "Average financing fee",
						description: "MarketStats: average financing fee",
					})}
					isPercentage={true}
					value={0.12}
				/>
			</div>
			<div className="w-full flex justify-center">
				<Statistic
					label={intl.formatMessage({
						defaultMessage: "Credit outstanding",
						description: "MarketStats: credit outstanding",
					})}
					currency="USDC"
					value={creditOutstanding}
				/>
			</div>
		</div>
	);
};
