import React, { FunctionComponent, useEffect, useState } from "react";
import { Fraction } from "@credix/credix-client";
import { DealAspect } from "@components/DealAspect";
import { classNames, compactFormatter, round } from "@utils/format.utils";
import Big from "big.js";
import {
	calculateDaysRemaining,
	calculateDaysRemainingRatio,
	calculateInterestRepaidRatio,
	calculatePrincipalRepaidRatio,
	totalInterestRepaid,
	totalPrincipalRepaid,
} from "@utils/deal.utils";
import { useIntl } from "react-intl";
import { DealWithNestedResources } from "@state/dealSlice";

interface DealAspectGridProps {
	deal: DealWithNestedResources;
	className?: string;
}

export const DealAspectGrid: FunctionComponent<DealAspectGridProps> = ({ deal, className }) => {
	const [interestRepaidRatio, setInterestRepaidRatio] = useState<Fraction>();
	const [principalRepaidRatio, setPrincipalRepaidRatio] = useState<Fraction>();
	const [daysRemainingRatio, setDaysRemainingRatio] = useState<Fraction>();
	const [principalRepaid, setPrincipalRepaid] = useState<number>(0);
	const [interestRepaid, setInterestRepaid] = useState<number>(0);
	const [daysRemaining, setDaysRemaining] = useState<number>(0);
	const intl = useIntl();

	useEffect(() => {
		if (deal) {
			const principalAmountRepaid = totalPrincipalRepaid(deal.repaymentSchedule);
			setPrincipalRepaid(principalAmountRepaid);
		}
	}, [deal]);

	useEffect(() => {
		if (deal) {
			const interestAmountRepaid = totalInterestRepaid(deal.repaymentSchedule);
			setInterestRepaid(interestAmountRepaid);
		}
	}, [deal]);

	useEffect(() => {
		if (deal) {
			const daysRemaining = round(
				Big(calculateDaysRemaining(deal, deal.repaymentSchedule)),
				Big.roundHalfEven
			).toNumber();
			setDaysRemaining(daysRemaining);
		}
	}, [deal]);

	useEffect(() => {
		if (deal) {
			const interestRatio = calculateInterestRepaidRatio(deal.repaymentSchedule);
			setInterestRepaidRatio(interestRatio);
		}
	}, [deal]);

	useEffect(() => {
		if (deal) {
			const principalRatio = calculatePrincipalRepaidRatio(deal.repaymentSchedule);
			setPrincipalRepaidRatio(principalRatio);
		}
	}, [deal]);

	useEffect(() => {
		if (deal) {
			const daysRatio = calculateDaysRemainingRatio(deal, deal.repaymentSchedule);
			setDaysRemainingRatio(daysRatio);
		}
	}, [deal]);

	className = classNames([className, "grid grid-cols-1 md:grid-cols-3 gap-5"]);

	return (
		<div className={className}>
			<DealAspect
				title={intl.formatMessage({
					defaultMessage: "Deal principal",
					description: "Deal aspect: principal",
				})}
				value={`${compactFormatter.format(deal.repaymentSchedule.totalPrincipal.uiAmount)} USDC`}
				icon="coin-dollar"
				emphasizeValue={true}
				dataCy="deal-aspect-principal"
			/>
			<DealAspect
				title={intl.formatMessage({
					defaultMessage: "Deal interest",
					description: "Deal aspect: interest",
				})}
				value={`${compactFormatter.format(deal.repaymentSchedule.totalInterest.uiAmount)} USDC`}
				dataCy="deal-aspect-interest"
			/>
			<DealAspect
				title={intl.formatMessage({
					defaultMessage: "Time to maturity",
					description: "Deal aspect: time to maturity",
				})}
				value={`${deal.repaymentSchedule.duration} DAYS`}
				dataCy="deal-aspect-time-to-maturity"
			/>
			{deal.goLiveAt && (
				<>
					<DealAspect
						title={intl.formatMessage({
							defaultMessage: "Principal repaid",
							description: "Deal aspect: principal repaid",
						})}
						value={`${principalRepaid} USDC`}
						ratio={principalRepaidRatio}
					/>
					<DealAspect
						title={intl.formatMessage({
							defaultMessage: "Interest repaid",
							description: "Deal aspect: interest repaid",
						})}
						value={`${interestRepaid} USDC`}
						ratio={interestRepaidRatio}
					/>
					<DealAspect
						title={intl.formatMessage({
							defaultMessage: "Time left",
							description: "Deal aspect: time left",
						})}
						value={intl.formatMessage(
							{
								defaultMessage: "{daysRemaining} DAYS",
								description: "Deal aspect: days remaining",
							},
							{ daysRemaining: daysRemaining }
						)}
						ratio={daysRemainingRatio}
					/>
				</>
			)}
		</div>
	);
};
