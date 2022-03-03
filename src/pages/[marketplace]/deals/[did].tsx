import { Button } from "@components/Button";
import { Link } from "@components/Link";
import { Tag } from "@components/Tag";
import { Deal as DealType, Ratio, useCredixClient } from "@credix/credix-client";
import { useWallet } from "@solana/wallet-adapter-react";
import Big from "big.js";
import { config } from "config";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { formatRatio, numberFormatter, toRatioAsNumber } from "utils/format.utils";

const Deal: NextPage = () => {
	const router = useRouter();
	const { marketplace, did } = router.query;
	const client = useCredixClient();
	const { publicKey } = useWallet();
	const [deal, setDeal] = useState<DealType>();
	const [interestRepaidRatio, setInterestRepaidRatio] = useState<Big | 0>();
	const [principalRepaidRatio, setPrincipalRepaidRatio] = useState<Big | 0>();
	const [daysRemainingRatio, setDaysRemainingRatio] = useState<Big | 0>(0);
	const [isAdmin, setIsAdmin] = useState<boolean>(false);

	const getDeal = useCallback(async () => {
		try {
			const market = await client?.fetchMarket(marketplace as string);
			// TODO: get the deal directly from the market once that's added to the client
			const deals = await market?.fetchDeals();
			setDeal(deals.find((deal) => deal.address.toString() === did));
		} catch {
			console.log("failed to fetch market");
		}
	}, [client, marketplace, did]);

	useEffect(() => {
		getDeal();
	}, [getDeal]);

	useEffect(() => {
		setPrincipalRepaidRatio(toRatioAsNumber(deal?.principal, deal?.principalAmountRepaid));
		setInterestRepaidRatio(toRatioAsNumber(deal?.principal, deal?.principalAmountRepaid));
		setDaysRemainingRatio(
			deal?.principalAmountRepaid &&
				formatRatio(new Ratio(deal?.timeToMaturity, deal?.daysRemaining))
		);
	}, [deal]);

	useEffect(() => {
		setIsAdmin(config.managementKeys.includes(publicKey?.toString()));
	}, [publicKey]);

	const activateDeal = async () => {
		try {
			await deal.activate();
			// TODO: trigger success message
		} catch {
			// TODO: trigger error message
		}
	};

	let tag = null;

	if (deal?.isInProgress()) {
		tag = <Tag type="active">Active</Tag>;
	} else if (deal?.isPending()) {
		tag = <Tag type="pending">Pending</Tag>;
	} else {
		tag = <Tag type="ended">Ended</Tag>;
	}

	return (
		<div className="px-4 py-5 md:pt-20 max-w-3xl flex flex-col justify-self-center">
			<Link to={`/${marketplace}/deals`} label="Go back to all deals" icon="chevron-left-square" />
			<div className="text-4xl font-sans pt-3 pb-5">{deal?.name}</div>
			<div className="bg-neutral-0 p-12 space-y-7">
				{tag}
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
							{numberFormatter.format(deal?.principal.toNumber())} USDC
						</div>
					</div>
					<div className="p-6 border border-solid border-neutral-60">
						<div>Financing Fee</div>
						<div className="text-2xl font-bold pt-2">
							{deal?.financingFeePercentage &&
								formatRatio(deal?.financingFeePercentage)?.toNumber()}
							%
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
								{numberFormatter.format(deal?.principalAmountRepaid.toNumber())} USDC
							</div>
							<div className="font-bold">{principalRepaidRatio}%</div>
						</div>
					</div>
					<div className="p-3 border border-solid border-neutral-60 relative">
						<div
							className={`absolute top-0 left-0 h-1 bg-neutral-60 w-[${interestRepaidRatio}%]`}
						></div>
						<div>Interest Repaid</div>
						<div className="flex justify-between items-center pt-2">
							<div className="text-2xl font-bold">
								{numberFormatter.format(deal?.interestRepaid.toNumber())} USDC
							</div>
							<div className="font-bold">{interestRepaidRatio}%</div>
						</div>
					</div>
					<div className="p-3 border border-solid border-neutral-60 relative">
						<div
							className={`absolute top-0 left-0 h-1 bg-neutral-60 w-[${daysRemainingRatio}%]`}
						></div>
						<div>Time Left</div>
						<div className="text-2xl font-bold pt-2">{deal?.daysRemaining} DAYS</div>
					</div>
				</div>
				{isAdmin && deal && deal.isPending() && (
					<Button type="default" className="mt-14" onClick={activateDeal}>
						Activate Deal
					</Button>
				)}
			</div>
		</div>
	);
};

export default Deal;
