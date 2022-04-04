import { RPCEndpoint } from "@credix_types/solana.types";
import { CredixClient } from "@credix/credix-client";
import { marketplaces } from "@consts";

export const getMarketsPaths = () =>
	marketplaces.map((marketplace) => ({ params: { marketplace } }));
