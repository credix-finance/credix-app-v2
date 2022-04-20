import React, { FunctionComponent, useEffect, useState } from "react";
import { Deal, Ratio } from "@credix/credix-client";
import { DealAspect } from "@components/DealAspect";
import { numberFormatter, toUIAmount } from "@utils/format.utils";
import Big from "big.js";
import {
	calculateDaysRemainingRatio,
	calculateInterestRepaidRatio,
	calculatePrincipalRepaidRatio,
} from "@utils/deal.utils";

interface DealAspectGridProps {
	deal: Deal;
}

const DealAspectGrid: FunctionComponent<DealAspectGridProps> = ({ deal }) => {
	const [interestRepaidRatio, setInterestRepaidRatio] = useState<Ratio>();
	const [principalRepaidRatio, setPrincipalRepaidRatio] = useState<Ratio>();
	const [daysRemainingRatio, setDaysRemainingRatio] = useState<Ratio>();

	useEffect(() => {
		const principalRatio = calculatePrincipalRepaidRatio(deal);
		setPrincipalRepaidRatio(principalRatio);

		const interestRatio = calculateInterestRepaidRatio(deal);
		setInterestRepaidRatio(interestRatio);

		const daysRatio = calculateDaysRemainingRatio(deal);
		setDaysRemainingRatio(daysRatio);
	}, [deal]);

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
			<DealAspect
				title="principal"
				value={`${numberFormatter.format(toUIAmount(new Big(deal.principal)).toNumber())} USDC`}
			/>
			<DealAspect
				title="financing fee"
				value={`${
					deal.financingFeePercentage && deal.financingFeePercentage.apply(100)?.toNumber()
				}%`}
			/>
			<DealAspect title="time to maturity" value={`${deal.timeToMaturity} DAYS`} />
			<DealAspect
				title="principal repaid"
				value={`${numberFormatter.format(
					toUIAmount(new Big(deal.principalAmountRepaid)).toNumber()
				)} USDC`}
				ratio={principalRepaidRatio}
			/>
			<DealAspect
				title="interest repaid"
				value={`${numberFormatter.format(
					toUIAmount(new Big(deal.interestRepaid)).toNumber()
				)} USDC`}
				ratio={interestRepaidRatio}
			/>
			<DealAspect
				title="time left"
				value={`${deal.daysRemaining} DAYS`}
				ratio={daysRemainingRatio}
				showRatio={false}
			/>
		</div>
	);
};

export default DealAspectGrid;
