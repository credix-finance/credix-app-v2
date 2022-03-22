import React from "react";
import { InvestmentReturn } from "@components/InvestmentReturn";
import { TokenAmount } from "@solana/web3.js";
import Big from "big.js";
import { formatNumber, numberFormatter } from "utils/format.utils";

interface InvestmentDetailsProps {
	balance: TokenAmount;
	balanceCurrency: string;
	investments: Big;
	investmentsCurrency: string;
	investmentsReturn?: number;
}

export const InvestmentDetails = ({
	balance,
	balanceCurrency,
	investments,
	investmentsCurrency,
	investmentsReturn,
}: InvestmentDetailsProps) => {
	return (
		<div className="md:flex space-y-2 md:space-y-0 md:space-x-4">
			<div className="rounded border border-solid border-neutral-40 bg-neutral-0 p-6 grid place-items-center md:block">
				<div className="text-xs md:text-base font-medium">Current balance</div>
				<div className="text-2xl font-bold">{`${
					balance ? numberFormatter.format(balance.uiAmount) : 0
				} ${balanceCurrency}`}</div>
			</div>
			<div className="rounded border border-solid border-neutral-40 bg-neutral-0 p-6 grid place-items-center md:block">
				<div className="flex justify-between items-start md:space-x-24 md:justify-start">
					<div className="text-xs md:text-base font-medium">Current investments</div>
					<InvestmentReturn value={investmentsReturn} className="hidden md:flex" />
				</div>
				<div>
					<div className="text-2xl font-bold">{`${
						investments && formatNumber(investments, 2, numberFormatter.format)
					} ${investmentsCurrency}`}</div>
				</div>
			</div>
		</div>
	);
};
