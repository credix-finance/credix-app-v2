import React, { FunctionComponent } from "react";
import { Icon, IconDimension } from "./Icon";
import { classNames, slicedBased58Key } from "@utils/format.utils";
import { useIntl } from "react-intl";
import { DealWithNestedResources } from "@state/dealSlice";

interface DealKeysProps {
	deal: DealWithNestedResources;
	className?: string;
}
export const DealKeys: FunctionComponent<DealKeysProps> = ({ deal, className }) => {
	const intl = useIntl();
	className = classNames([
		className,
		"flex border-t border-b border-neutral-40 py-6 justify-between text-mono font-bold text-base",
	]);

	return (
		<div className={className}>
			<div className="flex space-x-2">
				<Icon name="key" size={IconDimension.MIDDLE} />
				<div className="flex space-x-2">
					<div>
						{intl.formatMessage({
							defaultMessage: "Borrower public key",
							description: "Deal keys: borrower public key",
						})}
						:
					</div>
					<a
						className="hover:underline text-inherit"
						target="_blank"
						href={`https://explorer.solana.com/address/${deal.borrower.toString()}`}
						rel="noreferrer"
					>
						<div className="flex space-x-2">
							{slicedBased58Key(deal.borrower)}
							<Icon name="external-link" size={IconDimension.MIDDLE} />
						</div>
					</a>
				</div>
			</div>
			<div className="flex space-x-2">
				<Icon name="key" size={IconDimension.MIDDLE} />
				<div className="flex space-x-2">
					<div>
						{intl.formatMessage({
							defaultMessage: "Deal address",
							description: "Deal keys: deal address",
						})}
						:
					</div>
					<a
						className="hover:underline text-inherit"
						target="_blank"
						href={`https://explorer.solana.com/address/${deal.address.toString()}`}
						rel="noreferrer"
					>
						<div className="flex space-x-2">
							{slicedBased58Key(deal.address)}
							<Icon name="external-link" size={IconDimension.MIDDLE} />
						</div>
					</a>
				</div>
			</div>
		</div>
	);
};
