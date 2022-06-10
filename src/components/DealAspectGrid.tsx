import React, { FunctionComponent, useEffect, useState } from "react";
import { Deal, Fraction, RepaymentSchedule, Tranches } from "@credix/credix-client";
import { DealAspect } from "@components/DealAspect";
import { compactFormatter, toUIAmount } from "@utils/format.utils";
import Big from "big.js";
import {
	calculateDaysRemaining,
	calculateDaysRemainingRatio,
	calculateFinancingFee,
	calculateInterestRepaidRatio,
	calculatePrincipalRepaidRatio,
	totalInterestRepaid,
	totalPrincipalRepaid,
} from "@utils/deal.utils";
import { useIntl } from "react-intl";

interface DealAspectGridProps {
	deal: Deal;
	tranches: Tranches;
	repaymentSchedule: RepaymentSchedule;
}

const DealAspectGrid: FunctionComponent<DealAspectGridProps> = ({
	deal,
	tranches,
	repaymentSchedule,
}) => {
	const [interestRepaidRatio, setInterestRepaidRatio] = useState<Fraction>();
	const [principalRepaidRatio, setPrincipalRepaidRatio] = useState<Fraction>();
	const [daysRemainingRatio, setDaysRemainingRatio] = useState<Fraction>();
	const [principalRepaid, setPrincipalRepaid] = useState<number>(0);
	const [interestRepaid, setInterestRepaid] = useState<number>(0);
	const [daysRemaining, setDaysRemaining] = useState<number>(0);
	const [financingFee, setFinancingFee] = useState<Fraction>(new Fraction(1, 1));
	const intl = useIntl();

	useEffect(() => {
		if (tranches) {
			const principalAmountRepaid = totalPrincipalRepaid(tranches);
			setPrincipalRepaid(principalAmountRepaid);
		}
	}, [tranches]);

	useEffect(() => {
		if (tranches) {
			const interestAmountRepaid = totalInterestRepaid(tranches);
			setInterestRepaid(interestAmountRepaid);
		}
	}, [tranches]);

	useEffect(() => {
		if (deal && repaymentSchedule) {
			const daysRemaining = calculateDaysRemaining(deal, repaymentSchedule);
			setDaysRemaining(daysRemaining);
		}
	}, [deal, repaymentSchedule]);

	useEffect(() => {
		if (repaymentSchedule) {
			const financingFee = calculateFinancingFee(repaymentSchedule);
			setFinancingFee(financingFee);
		}
	}, [repaymentSchedule]);

	useEffect(() => {
		if (tranches && repaymentSchedule) {
			const interestRatio = calculateInterestRepaidRatio(tranches, repaymentSchedule);
			setInterestRepaidRatio(interestRatio);
		}
	}, [tranches, repaymentSchedule]);

	useEffect(() => {
		if (tranches && repaymentSchedule) {
			const principalRatio = calculatePrincipalRepaidRatio(tranches, repaymentSchedule);
			setPrincipalRepaidRatio(principalRatio);
		}
	}, [tranches, repaymentSchedule]);

	useEffect(() => {
		if (deal && repaymentSchedule) {
			const daysRatio = calculateDaysRemainingRatio(deal, repaymentSchedule);
			setDaysRemainingRatio(daysRatio);
		}
	}, [deal, repaymentSchedule]);

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
			<DealAspect
				title={intl.formatMessage({
					defaultMessage: "principal",
					description: "Deal aspect: principal",
				})}
				value={`${compactFormatter.format(
					toUIAmount(new Big(repaymentSchedule.totalPrincipal)).toNumber()
				)} USDC`}
			/>
			<DealAspect
				title={intl.formatMessage({
					defaultMessage: "financing fee",
					description: "Deal aspect: financing fee",
				})}
				value={`${financingFee && financingFee.apply(100)?.toNumber()}%`}
			/>
			<DealAspect
				title={intl.formatMessage({
					defaultMessage: "time to maturity",
					description: "Deal aspect: time to maturity",
				})}
				value={`${repaymentSchedule.duration} DAYS`}
			/>
			<DealAspect
				title={intl.formatMessage({
					defaultMessage: "principal repaid",
					description: "Deal aspect: principal repaid",
				})}
				value={`${compactFormatter.format(toUIAmount(new Big(principalRepaid)).toNumber())} USDC`}
				ratio={principalRepaidRatio}
			/>
			<DealAspect
				title={intl.formatMessage({
					defaultMessage: "interest repaid",
					description: "Deal aspect: interest repaid",
				})}
				value={`${compactFormatter.format(toUIAmount(new Big(interestRepaid)).toNumber())} USDC`}
				ratio={interestRepaidRatio}
			/>
			<DealAspect
				title={intl.formatMessage({
					defaultMessage: "time left",
					description: "Deal aspect: time left",
				})}
				value={intl.formatMessage(
					{ defaultMessage: "{daysRemaining} DAYS", description: "Deal aspect: days remaining" },
					{ daysRemaining: daysRemaining }
				)}
				ratio={daysRemainingRatio}
				showRatio={false}
			/>
		</div>
	);
};

export default DealAspectGrid;
