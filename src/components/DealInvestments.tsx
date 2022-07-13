import React, { FunctionComponent, useEffect, useState } from "react";
import { classNames } from "@utils/format.utils";
import { useIntl } from "react-intl";
import { TrancheInvestment } from "./TrancheInvestment";
import { DealWithNestedResources } from "@state/dealSlice";
import { DealStatus, Tranche } from "@credix/credix-client";
import { asyncFilter } from "@utils/async.utils";
import { useWallet } from "@solana/wallet-adapter-react";
import { TokenAmount } from "@solana/web3.js";
import { SENIOR_TRANCHE_INDEX } from "@consts";

interface DealInvestmentsProps {
	className?: string;
	deal: DealWithNestedResources;
	dealStatus: DealStatus;
}

export const DealInvestments: FunctionComponent<DealInvestmentsProps> = ({
	className,
	deal,
	dealStatus,
}) => {
	const intl = useIntl();
	className = classNames([className, "space-y-6"]);
	const [tranches, setTranches] = useState<Tranche[]>([]);
	const [userTrancheBalances, setUserTrancheBalances] = useState<{ index: TokenAmount }>();
	const { publicKey } = useWallet();

	useEffect(() => {
		const getInvestedTranches = async () => {
			const balances = {} as { index: TokenAmount };
			const tranches = await asyncFilter(deal.tranches.tranches, async (tranche) => {
				if (tranche.index === SENIOR_TRANCHE_INDEX) {
					return false;
				}

				try {
					const userTrancheBalance = await tranche.userTrancheBalance(publicKey);
					balances[tranche.index] = userTrancheBalance;
					return true;
				} catch (error) {
					// no tranche balance found
					return false;
				}
			});
			setUserTrancheBalances(balances);
			setTranches(tranches);
		};
		getInvestedTranches();
	}, [publicKey, deal.tranches.tranches]);

	if (tranches.length === 0) {
		return null;
	}

	return (
		<div className={className}>
			<div className="font-sans font-semibold text-3xl">
				{intl.formatMessage({
					defaultMessage: "Your investments",
					description: "Deal investments: title",
				})}
			</div>
			{tranches.map((tranche) => (
				<TrancheInvestment
					key={tranche.index}
					tranche={tranche}
					userTrancheBalance={userTrancheBalances[tranche.index]}
					deal={deal}
					dealStatus={dealStatus}
				/>
			))}
		</div>
	);
};
