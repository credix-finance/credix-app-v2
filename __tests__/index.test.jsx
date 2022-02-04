import { render } from "@testing-library/react";
import Overview from "../src/pages/index";

describe("Home", () => {
	it("renders a heading", () => {
		render(<Overview />);
	});
});
