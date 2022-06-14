import DealForm, { DealFormInput } from "@components/DealForm";
import Layout from "@components/Layout";
import { Link } from "@components/Link";
import { useCredixClient } from "@credix/credix-client";
import { PublicKey } from "@solana/web3.js";
import { getMarketsPaths } from "@utils/export.utils";
import { compactFormatter, toProgramAmount } from "@utils/format.utils";
import Big from "big.js";
import message from "message";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "pages/_app";
import React, { ReactElement, useEffect } from "react";
import { useStore } from "state/useStore";
import loadIntlMessages from "@utils/i18n.utils";
import { useIntl } from "react-intl";

const New: NextPageWithLayout = () => {
	const router = useRouter();
	const { marketplace } = router.query;
	const client = useCredixClient();
	const fetchMarket = useStore((state) => state.fetchMarket);
	const market = useStore((state) => state.market);
	const intl = useIntl();

	useEffect(() => {
		fetchMarket(client, marketplace as string);
	}, [client, fetchMarket, marketplace]);

	const onSubmit = async ({
		principal,
		financingFee,
		timeToMaturity,
		borrower,
		dealName,
	}: DealFormInput) => {
		const formattedPrincipal = compactFormatter.format(principal);
		const hide = message.loading({
			content: intl.formatMessage(
				{
					defaultMessage: "Creating deal for {amount} USDC",
					description: "New deal: create deal loading",
				},
				{
					amount: formattedPrincipal,
				}
			),
		});
		const borrowerPK = new PublicKey(borrower);

		try {
			const credixPass = await market.fetchCredixPass(borrowerPK);

			if (!credixPass) {
				hide();
				message.error({
					content: intl.formatMessage({
						defaultMessage: "No Credix Pass found for given public key",
						description: "New deal: Credix Pass validation failed",
					}),
				});
				return;
			}
		} catch {
			hide();
			message.error({
				content: intl.formatMessage({
					defaultMessage: "Failed to get Credix pass for given public key",
					description: "New deal: Credix Pass request failed",
				}),
			});
			return;
		}

		try {
			const principalProgramAmount = toProgramAmount(new Big(principal)).toNumber();
			await market.createDeal(
				principalProgramAmount,
				financingFee,
				timeToMaturity,
				borrowerPK,
				dealName
			);
			hide();
			message.success({
				content: intl.formatMessage(
					{
						defaultMessage: "Successfully created deal for {amount} USDC",
						description: "New deal: deal creation success",
					},
					{
						amount: formattedPrincipal,
					}
				),
			});
		} catch {
			hide();
			message.error({
				content: intl.formatMessage(
					{
						defaultMessage: "Failed to create deal for {amount} USDC",
						description: "New deal: deal creation failed",
					},
					{
						amount: formattedPrincipal,
					}
				),
			});
			return;
		}

		try {
			const borrowerInfo = await market.fetchBorrowerInfo(borrowerPK);
			const deal = await borrowerInfo.fetchDeal(borrowerInfo.numberOfDeals - 1);

			router.push(`/${marketplace}/deals/show?dealId=${deal.address.toString()}`);
		} catch {
			message.error({
				content: intl.formatMessage({
					defaultMessage: "Failed to get deal info",
					description: "New deal: deal info request failed",
				}),
			});
			router.push(`/${marketplace}/deals`);
		}
	};

	return (
		<div className="py-5 px-4 md:p-20 md:justify-self-center w-full">
			<Link to={`/${marketplace}/deals`} label="Go back to all deals" icon="chevron-left-square" />
			<div className="text-4xl font-sans pt-3 mb-8 capitalize">
				{intl.formatMessage({
					defaultMessage: "create new deal",
					description: "New deal: title",
				})}
			</div>
			<DealForm onSubmit={onSubmit} />
		</div>
	);
};

New.getLayout = function getLayout(page: ReactElement) {
	return (
		<Layout.WithSideMenu>
			<Layout.WithMainMenu showLogo={false}>{page}</Layout.WithMainMenu>
		</Layout.WithSideMenu>
	);
};

export async function getStaticPaths() {
	return {
		paths: getMarketsPaths(),
		fallback: true,
	};
}

export async function getStaticProps(ctx) {
	const { params } = ctx;
	return {
		props: {
			intlMessages: await loadIntlMessages(ctx),
			...params,
		},
	};
}

export default New;
