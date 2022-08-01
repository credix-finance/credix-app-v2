import { Fraction, RepaymentSchedule, Tranche } from "@credix/credix-client";
import { ratioFormatter } from "@utils/format.utils";
import { FunctionComponent, useEffect, useState } from "react";
import { defineMessages, useIntl } from "react-intl";

interface TrancheAPRProps {
	tranche: Tranche;
	repaymentSchedule: RepaymentSchedule;
	label?: boolean;
}

export const TrancheAPR: FunctionComponent<TrancheAPRProps> = ({
	tranche,
	repaymentSchedule,
	label = false,
}) => {
	const [apr, setAPR] = useState<Fraction>();
	const intl = useIntl();

	useEffect(() => {
		const getAPR = async () => {
			const apr = await tranche.calculateAPR(repaymentSchedule);
			setAPR(apr);
		};

		getAPR();
	}, [tranche, repaymentSchedule]);

	if (!apr) return null;

	return (
		<div>
			{label && intl.formatMessage(MESSAGES.apr)} {ratioFormatter.format(apr.toNumber())}
		</div>
	);
};

const MESSAGES = defineMessages({
	apr: {
		defaultMessage: "APR",
		description: "deal table apr label",
	},
});
