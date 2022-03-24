import { Deal, Ratio } from "@credix/credix-client";
import { FunctionComponent, useEffect, useState } from "react";
import { formatRatio, numberFormatter, toUIAmount } from "@utils/format.utils";
import { DealStatus } from "@components/DealStatus";
import { DealAspect } from "@components/DealAspect";
import Big from "big.js";

interface DealDetailsProps {
	deal: Deal;
}

export const DealDetails: FunctionComponent<DealDetailsProps> = ({ deal }) => {
	const [interestRepaidRatio, setInterestRepaidRatio] = useState<number | 0>();
	const [principalRepaidRatio, setPrincipalRepaidRatio] = useState<number | 0>();
	const [daysRemainingRatio, setDaysRemainingRatio] = useState<number | 0>(0);

	useEffect(() => {
		setPrincipalRepaidRatio(
			formatRatio(new Ratio(deal?.principalAmountRepaid.toNumber(), deal?.principal.toNumber()))
				.div(100)
				.toNumber()
		);

		if (deal?.interestToRepay.eq(new Big(0))) {
			setInterestRepaidRatio(1);
		} else {
			setInterestRepaidRatio(
				formatRatio(new Ratio(deal?.interestRepaid.toNumber(), deal?.interestToRepay.toNumber()))
					.div(100)
					.toNumber()
			);
		}

		setDaysRemainingRatio(
			deal?.principalAmountRepaid &&
				formatRatio(new Ratio(deal?.daysRemaining, deal?.timeToMaturity))?.div(100).toNumber()
		);
	}, [deal]);

	return (
		<div className="bg-neutral-0 p-12 space-y-7">
			<DealStatus deal={deal} />
			<div className="text-neutral-60 w-max">
				<div>Borrower Key</div>
				<div className="px-4 py-3 border border-solid border-neutral-60">
					{deal?.borrower.toString()}
				</div>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
				<DealAspect
					title="principal"
					value={`${numberFormatter.format(toUIAmount(deal?.principal)?.toNumber())} USDC`}
				/>
				<DealAspect
					title="financing fee"
					value={`${
						deal?.financingFeePercentage && formatRatio(deal?.financingFeePercentage)?.toNumber()
					}%`}
				/>
				<DealAspect title="time to maturity" value={`${deal?.timeToMaturity} DAYS`} />
				<DealAspect
					title="principal repaid"
					value={`${numberFormatter.format(
						toUIAmount(deal?.principalAmountRepaid)?.toNumber()
					)} USDC`}
					ratio={principalRepaidRatio}
				/>
				<DealAspect
					title="interest repaid"
					value={`${numberFormatter.format(toUIAmount(deal?.interestRepaid).toNumber())} USDC`}
					ratio={interestRepaidRatio}
				/>
				<DealAspect
					title="time left"
					value={`${deal?.daysRemaining} DAYS`}
					ratio={daysRemainingRatio}
				/>
			</div>
		</div>
	);
};
