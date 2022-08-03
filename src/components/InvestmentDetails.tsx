import React from "react";
import { compactFormatter } from "@utils/format.utils";
import { useIntl } from "react-intl";
import { Icon, IconDimension } from "./Icon";

interface InvestmentDetailsProps {
	balance: number;
	balanceCurrency: string;
}

export const InvestmentDetails = ({ balance, balanceCurrency }: InvestmentDetailsProps) => {
	const intl = useIntl();

	return (
		<div className="md:grid md:grid-cols-2 gap-12 space-y-2 md:space-y-0 md:space-x-4">
			<div className="rounded border border-solid border-neutral-40 p-6 grid place-items-center md:block">
				<div className="text-xs md:text-base font-medium flex items-center">
					<Icon name="trend-up" size={IconDimension.MIDDLE} className="mr-2" />
					{intl.formatMessage({
						defaultMessage: "Current value",
						description: "Investment details: current value",
					})}
				</div>
				<div className="text-2xl font-bold mt-2">{`${
					balance ? compactFormatter.format(balance) : 0
				} ${balanceCurrency}`}</div>
			</div>
		</div>
	);
};
