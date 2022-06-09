import React, { FunctionComponent, useEffect, useState } from "react";
import { Deal, Fraction } from "@credix/credix-client";
import { DealAspect } from "@components/DealAspect";
import { compactFormatter, toUIAmount } from "@utils/format.utils";
import Big from "big.js";
import {
	calculateDaysRemainingRatio,
	calculateInterestRepaidRatio,
	calculatePrincipalRepaidRatio,
} from "@utils/deal.utils";
import { useIntl } from "react-intl";

interface DealAspectGridProps {
	deal: Deal;
}

const DealAspectGrid: FunctionComponent<DealAspectGridProps> = ({ deal }) => {
	const [interestRepaidRatio, setInterestRepaidRatio] = useState<Fraction>();
	const [principalRepaidRatio, setPrincipalRepaidRatio] = useState<Fraction>();
	const [daysRemainingRatio, setDaysRemainingRatio] = useState<Fraction>();
	const intl = useIntl();

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
				title={intl.formatMessage({
					defaultMessage: "principal",
					description: "Deal aspect: principal",
				})}
				value={`${compactFormatter.format(toUIAmount(new Big(deal.principal)).toNumber())} USDC`}
			/>
			<DealAspect
				title={intl.formatMessage({
					defaultMessage: "financing fee",
					description: "Deal aspect: financing fee",
				})}
				value={`${
					deal.financingFeePercentage && deal.financingFeePercentage.apply(100)?.toNumber()
				}%`}
			/>
			<DealAspect
				title={intl.formatMessage({
					defaultMessage: "time to maturity",
					description: "Deal aspect: time to maturity",
				})}
				value={`${deal.timeToMaturity} DAYS`}
			/>
			<DealAspect
				title={intl.formatMessage({
					defaultMessage: "principal repaid",
					description: "Deal aspect: principal repaid",
				})}
				value={`${compactFormatter.format(
					toUIAmount(new Big(deal.principalAmountRepaid)).toNumber()
				)} USDC`}
				ratio={principalRepaidRatio}
			/>
			<DealAspect
				title={intl.formatMessage({
					defaultMessage: "interest repaid",
					description: "Deal aspect: interest repaid",
				})}
				value={`${compactFormatter.format(
					toUIAmount(new Big(deal.interestRepaid)).toNumber()
				)} USDC`}
				ratio={interestRepaidRatio}
			/>
			<DealAspect
				title={intl.formatMessage({
					defaultMessage: "time left",
					description: "Deal aspect: time left",
				})}
				value={intl.formatMessage(
					{ defaultMessage: "{daysRemaining} DAYS", description: "Deal aspect: days remaining" },
					{ daysRemaining: deal.daysRemaining }
				)}
				ratio={daysRemainingRatio}
				showRatio={false}
			/>
		</div>
	);
};

export default DealAspectGrid;
