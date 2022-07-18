import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { DealStatus, useCredixClient } from "@credix/credix-client";
import { useStore } from "@state/useStore";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "pages/_app";
import { getMarketsPaths } from "@utils/export.utils";
import Layout from "@components/Layout";
import loadIntlMessages from "@utils/i18n.utils";
import { DealWithNestedResources } from "@state/dealSlice";
import { DealHeader } from "@components/DealHeader";
import { Tag } from "@components/Tag";
import { useIntl } from "react-intl";
import { DealKeys } from "@components/DealKeys";
import { DealAspectGrid } from "@components/DealAspectGrid";
import { DealTrancheStructure } from "@components/DealTrancheStructure";
import { DealInvestments } from "@components/DealInvestments";
import { RepayDeal } from "@components/RepayDeal";
import { WithdrawFromDeal } from "@components/WithdrawFromDeal";
import { Button } from "@components/Button";
import { config } from "@config";
import { SolanaCluster } from "@credix_types/solana.types";
import { multisigUrl } from "@consts";
import { useWallet } from "@solana/wallet-adapter-react";
import { DealRepaymentSchedule } from "@components/DealRepaymentSchedule";
import { DealTrancheInvest } from "@components/DealTrancheInvest";

const Show: NextPageWithLayout = () => {
	const router = useRouter();
	const { marketplace, dealId } = router.query;
	const client = useCredixClient();
	const fetchMarket = useStore((state) => state.fetchMarket);
	const market = useStore((state) => state.market);
	const getDeal = useStore((state) => state.getDeal);
	const [deal, setDeal] = useState<DealWithNestedResources | null>();
	const [dealStatus, setDealStatus] = useState<DealStatus>();
	const intl = useIntl();
	const isAdmin = useStore((state) => state.isAdmin);
	const { publicKey } = useWallet();

	const redirectToMultisig = () => {
		window.open(multisigUrl, "_blank") || window.location.replace(multisigUrl);
	};

	const openDealForFunding = async () => {
		// We don't need multisig on localnet
		if (config.clusterConfig.name === SolanaCluster.LOCALNET) {
			await deal.openForFunding();
			await fetchMarket(client, marketplace as string);
		} else {
			redirectToMultisig();
		}
	};

	const activateDeal = async () => {
		// We don't need multisig on localnet
		if (config.clusterConfig.name === SolanaCluster.LOCALNET) {
			try {
				await deal.activate();
			} catch (error) {
				console.log(error);
			}
			await fetchMarket(client, marketplace as string);
		} else {
			redirectToMultisig();
		}
	};

	const getDealFromStore = useCallback(async () => {
		if (market) {
			const dealFromStore = await getDeal(client, market, dealId as string);
			setDeal(dealFromStore);
		}
	}, [client, market, dealId, getDeal]);

	const getDealStatus = useCallback(async () => {
		if (deal) {
			const dealStatus = await deal.status();

			setDealStatus(dealStatus);
		}
	}, [deal]);

	useEffect(() => {
		fetchMarket(client, marketplace as string);
	}, [fetchMarket, client, marketplace]);

	useEffect(() => {
		getDealFromStore();
	}, [getDealFromStore]);

	useEffect(() => {
		getDealStatus();
	}, [getDealStatus]);

	if (!deal) {
		return null;
	}

	let tag = null;
	switch (dealStatus) {
		case DealStatus.PENDING:
			tag = <PendingTag />;
			break;
		case DealStatus.IN_PROGRESS:
			tag = <ActiveTag />;
			break;
		case DealStatus.OPEN_FOR_FUNDING:
			tag = <OpenForFundingTag />;
			break;
		case DealStatus.CLOSED:
			tag = <ClosedTag />;
			break;

		default:
			break;
	}

	return (
		<div className="py-5 px-4 md:p-20 md:justify-self-center w-full">
			<DealHeader marketplace={marketplace as string} deal={deal} tag={tag}>
				{dealStatus === DealStatus.PENDING && isAdmin && (
					<Button onClick={openDealForFunding}>
						{intl.formatMessage({
							defaultMessage: "Open deal for funding",
							description: "Open for funding button: text",
						})}
					</Button>
				)}
				{dealStatus === DealStatus.OPEN_FOR_FUNDING && isAdmin && (
					<Button onClick={activateDeal}>
						{intl.formatMessage({
							defaultMessage: "Activate deal",
							description: "Activate deal button: text",
						})}
					</Button>
				)}
			</DealHeader>
			<DealKeys className="mt-8" deal={deal} />
			<DealAspectGrid deal={deal} className="mt-10" />
			<DealRepaymentSchedule className="mt-10" repaymentSchedule={deal.repaymentSchedule} />
			<DealTrancheStructure className="mt-16" deal={deal} />
			{(dealStatus === DealStatus.IN_PROGRESS || dealStatus === DealStatus.CLOSED) &&
				deal.borrower.equals(publicKey) && (
					<div className="grid grid-cols-2 gap-x-28 mt-16">
						<RepayDeal deal={deal} />
						<WithdrawFromDeal deal={deal} />
					</div>
				)}
			{(dealStatus === DealStatus.IN_PROGRESS || dealStatus === DealStatus.CLOSED) && (
				<DealInvestments className="mt-16" deal={deal} />
			)}
			{dealStatus === DealStatus.OPEN_FOR_FUNDING && (
				<DealTrancheInvest className="mt-16" deal={deal} />
			)}
		</div>
	);
};

Show.getLayout = function getLayout(page: ReactElement) {
	return (
		<Layout.WithSideMenu>
			<Layout.WithMainMenu showLogo={false}>{page}</Layout.WithMainMenu>
		</Layout.WithSideMenu>
	);
};

const PendingTag = () => {
	const intl = useIntl();
	return (
		<Tag color="midGray">
			{intl.formatMessage({
				defaultMessage: "Pending",
				description: "Deal status pending tag: text",
			})}
		</Tag>
	);
};

const ActiveTag = () => {
	const intl = useIntl();
	return (
		<Tag color="green">
			{intl.formatMessage({
				defaultMessage: "Active",
				description: "Deal status active tag: text",
			})}
		</Tag>
	);
};

const OpenForFundingTag = () => {
	const intl = useIntl();
	return (
		<Tag color="yellow">
			{intl.formatMessage({
				defaultMessage: "Open for funding",
				description: "Deal status open for funding tag: text",
			})}
		</Tag>
	);
};

const ClosedTag = () => {
	const intl = useIntl();
	return (
		<Tag color="orange">
			{intl.formatMessage({
				defaultMessage: "Closed",
				description: "Deal status closed tag: text",
			})}
		</Tag>
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

export default Show;
