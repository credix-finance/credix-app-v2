import { marketplaces } from "@consts";
import { getMarketDealsPaths, getMarketsPaths } from "@utils/export.utils";
describe("export", () => {
	it("should generate paths for all markets", () => {
		const paths = getMarketsPaths();

		expect(paths.length).toBe(marketplaces.length);
	});
});
