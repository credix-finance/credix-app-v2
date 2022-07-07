import React, { FunctionComponent, useEffect, useState, useCallback } from "react";
import { Card } from "@components/Card";
import { MarketStats } from "@components/MarketStats";
import { useCredixClient } from "@credix/credix-client";
import Link from "next/link";
import { dealsRoute, investWithdrawRoute, borrowerTypeformId, investorTypeformId } from "@consts";
import { useStore } from "@state/useStore";
import { Button, buttonTypeStyles, defaultButtonStyles } from "@components/Button";
import { useWallet } from "@solana/wallet-adapter-react";
import { PopupButton } from "@typeform/embed-react";

import { useIntl } from "react-intl";

interface MarketplaceProps {
	marketplace: string;
}

const Marketplace: FunctionComponent<MarketplaceProps> = (props) => {
	const intl = useIntl();
	const client = useCredixClient();
	const { publicKey } = useWallet();
	const fetchMarket = useStore((state) => state.fetchMarket);
	const market = useStore((state) => state.market);
	const [hasCredixPass, setHasCredixPass] = useState<boolean>(false);

	const fetchHasCredixPass = useCallback(async () => {
		try {
			const credixPass = await market.fetchCredixPass(publicKey);

			setHasCredixPass(!!credixPass);
		} catch {
			setHasCredixPass(false);
		}
	}, [publicKey, market]);

	useEffect(() => {
		fetchMarket(client, props.marketplace);
	}, [client, fetchMarket, props.marketplace]);

	useEffect(() => {
		fetchHasCredixPass();
	}, [fetchHasCredixPass]);

	const parties = [
		{
			name: intl.formatMessage({
				defaultMessage: "liquidity providers",
				description: "Marketplace component: invest party name",
			}),
			typeformId: investorTypeformId,
			action: "invest",
			buttonAction: "Invest",
			buttonLink: investWithdrawRoute.path,
			description: intl.formatMessage({
				defaultMessage:
					"Invest USDC in real-world-assets and earn attractive, risk adjusted returns.",
				description: "Marketplace component: invest description",
			}),
		},
		{
			name: "Borrowers",
			typeformId: borrowerTypeformId,
			action: "borrow",
			buttonAction: "deals",
			buttonLink: dealsRoute.path,
			description: intl.formatMessage({
				defaultMessage: "Borrow USDC against real-world-assets in weeks, not months.",
				description: "Marketplace component: borrow description",
			}),
		},
	];

	return (
		<main
			id="index"
			className="grid grid-cols-1 grid-auto-rows-min gap-y-8 md:grid-cols-12 md:gap-y-12 md:gap-x-14 justify-items-center"
		>
			<div className="md:text-center md:col-span-12 md:max-w-3xl grid justify-items-center max-w-lg">
				<h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold font-sans">
					{intl.formatMessage({
						defaultMessage: "Welcome to Credix",
						description: "Marketplace component: title",
					})}
				</h1>
				<div className="font-normal text-base md:max-w-lg">
					{intl.formatMessage({
						defaultMessage:
							"The new decentralized credit marketplace connecting investors with FinTechs in emerging markets",
						description: "Marketplace component: subtitle",
					})}
				</div>
			</div>
			<div className="md:col-span-12 w-full">
				<MarketStats market={market} />
			</div>
			<div className="ml-6 max-w-lg md:max-w-full md:col-span-12 md:flex md:justify-between md:space-x-20 space-y-8 md:space-y-0">
				{parties.map(({ name, action, buttonAction, buttonLink, description, typeformId }) => (
					<Card key={name} topTitle={name} title={action} offset="large">
						<div className="mb-14 text-base">{description}</div>
						{hasCredixPass ? (
							<Link href={`/${props.marketplace}${buttonLink}`}>
								<a>
									<Button block={true} className="capitalize">
										{buttonAction}
									</Button>
								</a>
							</Link>
						) : (
							<PopupButton
								id={typeformId}
								className={`${defaultButtonStyles} ${buttonTypeStyles["primary"]}} w-full capitalize hover:cursor-pointer border-b-0 border-r-0`}
							>
								{buttonAction}
							</PopupButton>
						)}
					</Card>
				))}
			</div>
		</main>
	);
};

export default Marketplace;
