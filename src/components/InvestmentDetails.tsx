import React from "react";
import { InvestmentReturn } from "@components/InvestmentReturn";

interface InvestmentDetailsProps {
	balance: number;
	balanceCurrency: string;
	investments: number;
	investmentsCurrency: string;
	investmentsReturn: number;
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
				<div className="text-2xl font-bold">{`${balance} ${balanceCurrency}`}</div>
			</div>
			<div className="rounded border border-solid border-neutral-40 bg-neutral-0 p-6 grid place-items-center md:block">
				<div className="flex justify-between items-start md:space-x-24 md:justify-start">
					<div className="text-xs md:text-base font-medium">Current investments</div>
					<div className="hidden md:block">
						<InvestmentReturn value={investmentsReturn} />
					</div>
				</div>
				<div>
					<div className="text-2xl font-bold">{`${investments} ${investmentsCurrency}`}</div>
				</div>
			</div>
		</div>
	);
};
