import { marketplaces } from "@consts";
import { RPCEndpoint } from "@credix_types/solana.types";
import { getMarketDealsPaths, getMarketsPaths } from "@utils/export.utils";

describe("export", () => {
	it("should generate paths for all markets", () => {
		const paths = getMarketsPaths();

		expect(paths.length).toBe(marketplaces.length);
	});
	it("should generate a list of all the deals for all markets", async () => {
		const paths = await getMarketDealsPaths(RPCEndpoint.DEVNET);

		expect(paths.length).toBeGreaterThan(0);

		paths.forEach(({ params }) => {
			expect(params.marketplace).not.toBeNull();
			expect(params.did).not.toBeNull();
		});
	});
});
