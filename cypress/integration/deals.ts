const validDealInput = {
	name: "test deal 1234567890",
	borrower: "Ej5zJzej7rrUoDngsJ3jcpfuvfVyWpcDcK7uv9cE2LdL",
	principal: Number(1_000_000).toString(),
	financingFee: "15",
	timeToMaturity: "300",
};

before(() => {
	let wallet;

	cy.visit("http://localhost:3000/");

	cy.window()
		.then((win) => {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			wallet = win.solana;
		})
		.then(() => wallet.connect());

	cy.visit("http://localhost:3000/credix-marketplace/deals");

	cy.connectWallet();
});

describe("Deals page", () => {
	it("shows the deals table with tabs", () => {
		cy.get("#rc-tabs-0-tab-pendingDealsTab").click();

		cy.get("#rc-tabs-0-tab-endedDealsTab").click();

		cy.get("#rc-tabs-0-tab-activeDealsTab").click();
	});

	it("Navigates to the new deal page and creates a deal", () => {
		cy.get("[data-cy=create-deal-button]").click();

		cy.get("[data-cy=deal-form-name-input]").type(validDealInput.name);

		cy.get("[data-cy=deal-form-borrower-input]").type(validDealInput.borrower);

		cy.get("[data-cy=deal-form-principal-input]").type(validDealInput.principal);

		cy.get("[data-cy=deal-form-financing-fee-input]").type(validDealInput.financingFee);

		cy.get("[data-cy=deal-form-time-to-maturity-input]").type(validDealInput.timeToMaturity);

		cy.get("[data-cy=deal-form-submit-button]").click();

		cy.intercept("POST", "**.solana.*").as("postTransaction");

		cy.wait("@postTransaction").its("response.statusCode").should("be.oneOf", [200, 304]);
		cy.wait("@postTransaction").its("response.statusCode").should("be.oneOf", [200, 304]);
		cy.wait("@postTransaction").its("response.statusCode").should("be.oneOf", [200, 304]);
		cy.wait("@postTransaction").its("response.statusCode").should("be.oneOf", [200, 304]);
		cy.wait("@postTransaction").its("response.statusCode").should("be.oneOf", [200, 304]);
		cy.wait("@postTransaction").its("response.statusCode").should("be.oneOf", [200, 304]);

		cy.get("[data-cy=deal-name]").contains(validDealInput.name);
	});
});
