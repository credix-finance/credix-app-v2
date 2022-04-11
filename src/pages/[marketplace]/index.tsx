import React, { ReactElement } from "react";
import { useRouter } from "next/router";
import Layout from "@components/Layout";
import { NextPageWithLayout } from "pages/_app";
import Marketplace from "@components/Marketplace";
import { getMarketsPaths } from "@utils/export.utils";
import loadIntlMessages from "@utils/i18n.utils";

const Overview: NextPageWithLayout = () => {
	const router = useRouter();
	const { marketplace } = router.query;

	return <Marketplace marketplace={marketplace as string} />;
};

Overview.getLayout = function getLayout(page: ReactElement) {
	return <Layout.WithMainMenu>{page}</Layout.WithMainMenu>;
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

export default Overview;
