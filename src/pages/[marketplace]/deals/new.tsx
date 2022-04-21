import DealForm, { DealFormInput } from "@components/DealForm";
import Layout from "@components/Layout";
import { Link } from "@components/Link";
import { useCredixClient } from "@credix/credix-client";
import { PublicKey } from "@solana/web3.js";
import { getMarketsPaths } from "@utils/export.utils";
import { numberFormatter, toProgramAmount } from "@utils/format.utils";
import Big from "big.js";
import message from "message";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "pages/_app";
import React, { ReactElement, useEffect } from "react";
import { useStore } from "state/useStore";

const New: NextPageWithLayout = () => {
	const router = useRouter();
	const { marketplace } = router.query;
	const client = useCredixClient();
	const fetchMarket = useStore((state) => state.fetchMarket);
	const market = useStore((state) => state.market);

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
		const formattedPrincipal = numberFormatter.format(principal);
		const hide = message.loading({ content: `Creating deal for ${formattedPrincipal} USDC` });
		const borrowerPK = new PublicKey(borrower);

		try {
			const credixPass = await market.fetchCredixPass(borrowerPK);

			if (!credixPass) {
				hide();
				message.error({ content: "No Credix Pass found for given public key" });
				return;
			}
		} catch {
			hide();
			message.error({ content: "Failed to get Credix pass for given public key" });
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
			message.success({ content: `Successfully created deal for ${formattedPrincipal} USDC` });
		} catch {
			hide();
			message.error({ content: `Failed to create deal for ${formattedPrincipal} USDC` });
			return;
		}

		try {
			const borrowerInfo = await market.fetchBorrowerInfo(borrowerPK);
			const deal = await borrowerInfo.fetchDeal(borrowerInfo.numberOfDeals - 1);

			router.push(`/${marketplace}/deals/show?dealId=${deal.address.toString()}`);
		} catch {
			message.error({ content: "Failed to get deal info" });
			router.push(`/${marketplace}/deals`);
		}
	};

	return (
		<div className="py-5 px-4 md:px-20 md:justify-self-center md:w-full md:max-w-7xl lg:max-w-5xl">
			<Link to={`/${marketplace}/deals`} label="Go back to all deals" icon="chevron-left-square" />
			<div className="text-4xl font-sans pt-3 mb-9">New Deal</div>
			<div className="bg-neutral-0 py-10 px-14 space-y-7">
				<DealForm onSubmit={onSubmit} />
			</div>
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

export async function getStaticProps({ params }) {
	return { props: params };
}

export default New;
