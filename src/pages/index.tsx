import React, { ReactElement } from "react";
import Layout from "@components/Layout";
import { NextPageWithLayout } from "pages/_app";
import Marketplace from "@components/Marketplace";
import { defaultMarketplace } from "@consts";

const Overview: NextPageWithLayout = () => {
	return <Marketplace marketplace={defaultMarketplace} />;
};

Overview.getLayout = function getLayout(page: ReactElement) {
	return <Layout.WithMainMenu>{page}</Layout.WithMainMenu>;
};

export default Overview;
