import React from "react";
import { defineMessages, useIntl } from "react-intl";

export const Footer = () => {
	const intl = useIntl();
	const date = intl.formatDate(new Date());

	return (
		<div className="flex justify-center text-xs border-t border-credix-secondary">
			<footer className="max-w-5xl w-full py-8 text-micro leading-[10px] font-normal">
				<div>{intl.formatMessage(MESSAGES.apr)}</div>
				<div>{intl.formatMessage(MESSAGES.disclaimer, { date })}</div>
			</footer>
		</div>
	);
};

const MESSAGES = defineMessages({
	apr: {
		defaultMessage: "APR is subject to change.",
		description: "footer: apr",
	},
	disclaimer: {
		defaultMessage: `The information herein is provided to accredited investors and for convenience only.
			Data and values are current as of {date}, and subject to change.
			Past performance does not guarantee future results.
			All investments carry risk, including the loss of your entire investment.
			Credix does not provide investment advice, and is not responsible for the reliability, accuracy, or completeness of third-party information.
			This does not constitute an offer or the solicitation of an offer to sell securities, and this material should not be relied upon in making any investment decision(s).`,
		description: "footer: legal disclaimer",
	},
});
