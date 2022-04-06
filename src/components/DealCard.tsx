import React, { FunctionComponent } from "react";
import { Link } from "@components/Link";
import { Deal } from "@credix/credix-client";

interface DealCardProps {
	marketplace: string;
	deal: Deal;
	children: React.ReactNode;
}

export const DealCard: FunctionComponent<DealCardProps> = ({ marketplace, deal, children }) => {
	return (
		<div className="px-4 py-5 w-full max-w-3xl flex flex-col justify-self-center">
			<Link to={`/${marketplace}/deals`} label="Go back to all deals" icon="chevron-left-square" />
			<div className="text-4xl font-sans pt-3 pb-9 break-words">{deal.name}</div>
			<div className="bg-neutral-0 py-10 px-14 ">{children}</div>
		</div>
	);
};
