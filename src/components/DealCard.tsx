import React, { FunctionComponent } from "react";
import { Link } from "@components/Link";
import { Deal } from "@credix/credix-client";
import { useIntl } from "react-intl";

interface DealCardProps {
	marketplace: string;
	deal: Deal;
	children: React.ReactNode;
}

export const DealCard: FunctionComponent<DealCardProps> = ({ marketplace, deal, children }) => {
	const intl = useIntl();

	return (
		<div className="px-4 py-5 w-full max-w-3xl flex flex-col justify-self-center">
			<Link
				to={`/${marketplace}/deals`}
				label={intl.formatMessage({
					defaultMessage: "Go back to all deals",
					description: "Deal card: back to all deals link",
				})}
				icon="chevron-left-square"
			/>
			<div data-cy="deal-name" className="text-4xl font-sans mt-4 break-words">
				{deal.name}
			</div>
			<div className="bg-neutral-0 py-10 px-14 mt-8">{children}</div>
		</div>
	);
};
