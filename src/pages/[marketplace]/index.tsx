import { ReactElement } from "react";
import { useRouter } from "next/router";
import Layout from "@components/Layout";
import { NextPageWithLayout } from "pages/_app";
import Marketplace from "@components/Marketplace";

const Overview: NextPageWithLayout = () => {
	const router = useRouter();
	const { marketplace } = router.query;

	return <Marketplace marketplace={marketplace as string} />;
};

Overview.getLayout = function getLayout(page: ReactElement) {
	return <Layout.WithMainMenu>{page}</Layout.WithMainMenu>;
};

export default Overview;
