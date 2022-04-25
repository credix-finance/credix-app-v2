import React, { ReactElement } from "react";
import Layout from "@components/Layout";
import { NextPageWithLayout } from "pages/_app";
import Marketplace from "@components/Marketplace";
import { defaultMarketplace } from "@consts";
import loadIntlMessages from "@utils/i18n.utils";

export async function getStaticProps(ctx) {
	return {
		props: {
			intlMessages: await loadIntlMessages(ctx),
		},
	};
}

const Overview: NextPageWithLayout = () => {
	return <Marketplace marketplace={defaultMarketplace} />;
};

Overview.getLayout = function getLayout(page: ReactElement) {
	return <Layout.WithMainMenu>{page}</Layout.WithMainMenu>;
};

export default Overview;
