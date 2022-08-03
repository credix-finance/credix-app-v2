import { zeroTokenAmount } from "@consts";
import { Fraction, Market } from "@credix/credix-client";
import { TokenAmount } from "@solana/web3.js";
import React, { useEffect, useState } from "react";
import { defineMessages, useIntl } from "react-intl";
import { Statistic } from "./Statistic";

interface MarketStatsProps {
	market: Market;
}

export const MarketStats = ({ market }: MarketStatsProps) => {
	const [creditOutstanding, setCreditOutstanding] = useState<TokenAmount>(zeroTokenAmount);
	const [tvl, setTvl] = useState<TokenAmount>(zeroTokenAmount);
	const [weightedAverageFinancingFee, setWeightedAverageFinancingFee] = useState<Fraction>(
		new Fraction(0, 1)
	);
	const intl = useIntl();

	useEffect(() => {
		const getTVL = async () => {
			if (market) {
				const tvl = await market.calculateTVL();
				setTvl(tvl);
			}
		};
		getTVL();
	}, [market]);

	useEffect(() => {
		const getCreditOutstanding = async () => {
			if (market) {
				const totalOutstandingCredit = await market.totalOutstandingCredit();
				setCreditOutstanding(totalOutstandingCredit);
			}
		};
		getCreditOutstanding();
	}, [market]);

	useEffect(() => {
		const getWeightedAverageFinancingFee = async () => {
			if (market) {
				const weightedAverageFinancingFee = await market.calculateWeightedAverageFinancingFee();
				setWeightedAverageFinancingFee(weightedAverageFinancingFee);
			}
		};

		getWeightedAverageFinancingFee();
	}, [market]);
	return (
		<div className="grid grid-cols-1 gap-y-8 md:grid-cols-3 md:gap-x-14 md:gap-y-12">
			<div className="w-full flex justify-center">
				<Statistic label={intl.formatMessage(MESSAGES.tvl)} currency="USDC" value={tvl.uiAmount} />
			</div>
			<div className="w-full flex justify-center">
				<Statistic
					label={intl.formatMessage(MESSAGES.averageFinancingFee)}
					isPercentage={true}
					value={weightedAverageFinancingFee.toNumber()}
				/>
			</div>
			<div className="w-full flex justify-center">
				<Statistic
					label={intl.formatMessage(MESSAGES.creditOutstanding)}
					currency="USDC"
					value={creditOutstanding.uiAmount}
				/>
			</div>
		</div>
	);
};

const MESSAGES = defineMessages({
	creditOutstanding: {
		defaultMessage: "Credit outstanding",
		description: "MarketStats: credit outstanding",
	},
	averageFinancingFee: {
		defaultMessage: "Average financing fee",
		description: "MarketStats: average financing fee",
	},
	tvl: {
		defaultMessage: "TVL",
		description: "MarketStats: total value locked",
	},
});
