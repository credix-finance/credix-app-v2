import React, { FunctionComponent, useEffect, useState } from "react";
import { Fraction } from "@credix/credix-client";
import { DealAspect } from "@components/DealAspect";
import { classNames, compactFormatter, ratioFormatter, round } from "@utils/format.utils";
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
	const [financingFee, setFinancingFee] = useState<Fraction>(new Fraction(0, 1));
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
			const daysRemaining = calculateDaysRemaining(deal, deal.repaymentSchedule);
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

	useEffect(() => {
		const getWeightedAverageFinancingFee = async () => {
			const financingFee = await deal.repaymentSchedule.calculateFinancingFee();
			setFinancingFee(financingFee);
		};

		if (deal) {
			getWeightedAverageFinancingFee();
		}
	}, [deal]);

	className = classNames([className, "grid grid-cols-1 md:grid-cols-3 gap-5"]);

	return (
		<div className={className}>
			<DealAspect
				title={intl.formatMessage({
					defaultMessage: "Principal",
					description: "Deal aspect: principal",
				})}
				value={`${compactFormatter.format(deal.repaymentSchedule.totalPrincipal.uiAmount)} USDC`}
				icon="coin-dollar"
			/>
			<DealAspect
				title={intl.formatMessage({
					defaultMessage: "Interest",
					description: "Deal aspect: interest",
				})}
				value={`${compactFormatter.format(deal.repaymentSchedule.totalInterest.uiAmount)} USDC`}
			/>
			<DealAspect
				title={intl.formatMessage({
					defaultMessage: "Financing fee",
					description: "Deal aspect: financing fee",
				})}
				value={ratioFormatter.format(financingFee.toNumber())}
			/>
			{deal.goLiveAt && (
				<>
					<DealAspect
						title={intl.formatMessage({
							defaultMessage: "Principal repaid",
							description: "Deal aspect: principal repaid",
						})}
						value={`${round(principalRepaid, Big.roundDown, 0)} USDC`}
						ratio={principalRepaidRatio}
					/>
					<DealAspect
						title={intl.formatMessage({
							defaultMessage: "Interest repaid",
							description: "Deal aspect: interest repaid",
						})}
						value={`${round(interestRepaid, Big.roundDown, 0)} USDC`}
						ratio={interestRepaidRatio}
					/>
					<DealAspect
						title={intl.formatMessage({
							defaultMessage: "Time left",
							description: "Deal aspect: time left",
						})}
						value={
							<div>
								<span>{round(daysRemaining, Big.roundHalfEven, 0).toString()}</span>
								<span className="text-disabled">/{deal.repaymentSchedule.duration}&nbsp;</span>
								<span>
									{intl.formatMessage({
										defaultMessage: " DAYS",
										description: "Deal aspect: days",
									})}
								</span>
							</div>
						}
						ratio={daysRemainingRatio}
					/>
				</>
			)}
		</div>
	);
};
