import renderer from "react-test-renderer";
import Overview from "../src/pages/index";

describe("Home", () => {
	it("renders a heading", () => {
		const component = renderer.create(<Overview />);

		const tree = component.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
