import Layout from "@components/Layout";
import React, { ReactElement } from "react";

// We don't actually use this page because a redirect happens but we need it anyways because otherwise we don't have an index.html to serve
function Dummy() {
	return <div className="px-28 py-11">Something went wrong</div>;
}

Dummy.getLayout = function getLayout(page: ReactElement) {
	return (
		<Layout.WithSideMenu>
			<Layout.WithMainMenu showLogo={false}>{page}</Layout.WithMainMenu>
		</Layout.WithSideMenu>
	);
};

export default Dummy;
