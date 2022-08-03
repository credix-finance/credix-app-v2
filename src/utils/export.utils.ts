import { marketplaces } from "@consts";

export const getMarketsPaths = () =>
	marketplaces.map((marketplace) => ({ params: { marketplace } }));
