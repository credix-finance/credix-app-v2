import React, { FunctionComponent, ReactNode, useEffect, useState } from "react";
import { Fraction } from "@credix/credix-client";
import { trancheFillColors } from "@consts";
import { TokenAmount } from "@solana/web3.js";

interface TrancheFillLevelProps {
	amountDeposited: TokenAmount;
	size: TokenAmount;
	trancheIndex: number;
	children?: ReactNode;
}

export const TrancheFillLevel: FunctionComponent<TrancheFillLevelProps> = ({
	size,
	amountDeposited,
	trancheIndex,
	children,
}) => {
	const heightInPx = 400;
	const [filledHeightInPx, setFilledHeightInPx] = useState(0);
	const [unFilledHeightInPx, setUnFilledHeightInPx] = useState(0);
	const [amountDepositedPercentage, setAmountDepositedPercentage] = useState<Fraction>();

	useEffect(() => {
		setAmountDepositedPercentage(new Fraction(amountDeposited.uiAmount, size.uiAmount));
	}, [amountDeposited, size]);

	useEffect(() => {
		if (amountDepositedPercentage) {
			setFilledHeightInPx(amountDepositedPercentage.apply(heightInPx).toNumber());
		}
	}, [amountDepositedPercentage]);

	useEffect(() => {
		setUnFilledHeightInPx(heightInPx - filledHeightInPx);
	}, [filledHeightInPx]);

	return (
		<div className={`w-[400px] h-[${heightInPx}px] relative`}>
			<div
				className="w-full"
				style={{
					backgroundColor: trancheFillColors[trancheIndex].unfilled,
					height: unFilledHeightInPx,
				}}
			></div>
			<div
				className="w-full"
				style={{
					backgroundColor: trancheFillColors[trancheIndex].filled,
					height: filledHeightInPx,
				}}
			></div>
			{children}
		</div>
	);
};
