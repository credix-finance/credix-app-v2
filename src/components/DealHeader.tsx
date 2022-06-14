import React, { FunctionComponent, ReactNode } from "react";
import { Link } from "@components/Link";
import { useIntl } from "react-intl";

interface DealHeaderProps {
	marketplace: string;
	dealName: string;
	tag: ReactNode;
	children?: ReactNode;
}

export const DealHeader: FunctionComponent<DealHeaderProps> = ({
	marketplace,
	dealName,
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
				<div className="flex items-center space-x-6">
					<div className="font-sans font-semibold text-7xl">{dealName}</div>
					{tag}
				</div>
				{children}
			</div>
		</div>
	);
};
