import React, { FunctionComponent, ReactNode } from "react";
import { Link } from "@components/Link";
import { useIntl } from "react-intl";
import { Deal } from "@credix/credix-client";

interface DealHeaderProps {
	marketplace: string;
	deal: Deal;
	tag: ReactNode;
	children?: ReactNode;
}

export const DealHeader: FunctionComponent<DealHeaderProps> = ({
	marketplace,
	deal,
	tag,
	children,
}) => {
	const intl = useIntl();

	return (
		<div>
			<Link
				to={`/${marketplace}/deals`}
				label={intl.formatMessage({
					defaultMessage: "Go back to all deals",
					description: "Deal card: back to all deals link",
				})}
				icon="chevron-left-square"
			/>
			<div className="mt-8 flex justify-between items-center">
				<div className="flex items-center">
					<div className="font-sans font-semibold text-7xl">{deal.name}</div>
					<div className="px-6">{tag}</div>
				</div>
				{children}
			</div>
		</div>
	);
};
