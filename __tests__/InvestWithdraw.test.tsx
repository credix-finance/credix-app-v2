import React from "react";
import { render } from "@testing-library/react";
import { InvestWithdraw } from "@components/InvestWithdraw";

test("Default", () => {
	const component = render(<InvestWithdraw />);

	expect(component).toMatchSnapshot();
});
