import { Deal, Ratio } from "@credix/credix-client";
import { FunctionComponent, useEffect, useState } from "react";
import {
	clamp,
	formatRatio,
	numberFormatter,
	ratioFormatter,
	toUIAmount,
} from "@utils/format.utils";
import { DealStatus } from "@components/DealStatus";

interface DealDetailsProps {
	deal: Deal;
}

const DealDetails: FunctionComponent<DealDetailsProps> = ({ deal }) => {
	const [interestRepaidRatio, setInterestRepaidRatio] = useState<number | 0>();
	const [principalRepaidRatio, setPrincipalRepaidRatio] = useState<number | 0>();
	const [daysRemainingRatio, setDaysRemainingRatio] = useState<number | 0>(0);

	useEffect(() => {
		setPrincipalRepaidRatio(
			formatRatio(new Ratio(deal?.principalAmountRepaid.toNumber(), deal?.principal.toNumber()))
				.div(100)
				.toNumber()
		);
		setInterestRepaidRatio(
			formatRatio(new Ratio(deal?.interestRepaid.toNumber(), deal?.interestToRepay.toNumber()))
				.div(100)
				.toNumber()
		);
		setDaysRemainingRatio(
			deal?.principalAmountRepaid &&
				formatRatio(new Ratio(deal?.daysRemaining, deal?.timeToMaturity))?.toNumber()
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
				<div className="p-6 border border-solid border-neutral-60">
					<div>Pricipal</div>
					<div className="text-2xl font-bold pt-2">
						{numberFormatter.format(toUIAmount(deal?.principal)?.toNumber())} USDC
					</div>
				</div>
				<div className="p-6 border border-solid border-neutral-60">
					<div>Financing Fee</div>
					<div className="text-2xl font-bold pt-2">
						{deal?.financingFeePercentage && formatRatio(deal?.financingFeePercentage)?.toNumber()}%
					</div>
				</div>
				<div className="p-6 border border-solid border-neutral-60">
					<div>Time to Maturity</div>
					<div className="text-2xl font-bold pt-2">{deal?.timeToMaturity} DAYS</div>
				</div>
				<div className="p-3 border border-solid border-neutral-60">
					<div>Principal Repaid</div>
					<div className="flex justify-between items-center pt-2">
						<div className="text-2xl font-bold">
							{numberFormatter.format(toUIAmount(deal?.principalAmountRepaid)?.toNumber())} USDC
						</div>
						<div className="font-bold">{ratioFormatter.format(principalRepaidRatio)}</div>
					</div>
				</div>
				<div className="p-3 border border-solid border-neutral-60 relative">
					<div
						className="absolute top-0 left-0 h-1 bg-neutral-60"
						style={{ width: `${clamp(interestRepaidRatio, 0, 100)}%` }}
					></div>
					<div>Interest Repaid</div>
					<div className="flex justify-between items-center pt-2">
						<div className="text-2xl font-bold">
							{numberFormatter.format(toUIAmount(deal?.interestRepaid).toNumber())} USDC
						</div>
						<div className="font-bold">{ratioFormatter.format(interestRepaidRatio)}</div>
					</div>
				</div>
				<div className="p-3 border border-solid border-neutral-60 relative">
					<div
						className="absolute top-0 left-0 h-1 bg-neutral-60"
						style={{ width: `${clamp(daysRemainingRatio, 0, 100)}%` }}
					></div>
					<div>Time Left</div>
					<div className="text-2xl font-bold pt-2">{deal?.daysRemaining} DAYS</div>
				</div>
			</div>
		</div>
	);
};

export default DealDetails;
