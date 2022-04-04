import { ReactElement } from "react";
import { useRouter } from "next/router";
import Layout from "@components/Layout";
import { NextPageWithLayout } from "pages/_app";
import Marketplace from "@components/Marketplace";
import { getMarketsPaths } from "@utils/export.utils";

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

export async function getStaticProps({ params }) {
	return { props: params };
}

export default Overview;
