const validDealInput = {
	name: "test deal 1234567890",
	borrower: "Ej5zJzej7rrUoDngsJ3jcpfuvfVyWpcDcK7uv9cE2LdL",
	principal: Number(1_000_000).toString(),
	financingFee: "15",
	timeToMaturity: "300",
};

const pendingDealData = {
	tag: "Pending",
	formattedPrincipal: "1M USDC",
	formattedInterest: "70K USDC",
	formattedTTM: `${validDealInput.timeToMaturity} DAYS`,
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
		cy.get("#rc-tabs-0-tab-pendingDeals").click();

		cy.get("#rc-tabs-0-tab-openForFundingDeals").click();

		cy.get("#rc-tabs-0-tab-inProgressDeals").click();

		cy.get("#rc-tabs-0-tab-closedDeals").click();
	});

	it("Navigates to the new deal page and creates a deal", () => {
		cy.get("[data-cy=create-deal-button]").click();

		cy.get("[data-cy=deal-form-name-input]").type(validDealInput.name);
		cy.get("[data-cy=deal-form-borrower-input]").type(validDealInput.borrower);
		cy.get("[data-cy=deal-form-principal-input]").type(validDealInput.principal);
		cy.get("[data-cy=deal-form-financing-fee-input]").type(validDealInput.financingFee);
		cy.get("[data-cy=deal-form-time-to-maturity-input]").type(validDealInput.timeToMaturity);

		cy.get("[data-cy=deal-form-repayment-type-amortization]").click();

		cy.get("[data-cy=deal-form-next-step-button]").click();

		cy.get("[data-cy=deal-form-tranches-step-next-button]").click();

		cy.get("[data-cy=deal-form-submit-button]").click();

		cy.get("[data-cy=deal-name]").contains(validDealInput.name);
		cy.get("[data-cy=tag]").contains(pendingDealData.tag);
		cy.get("[data-cy=deal-aspect-principal]").contains(pendingDealData.formattedPrincipal);
		cy.get("[data-cy=deal-aspect-interest]").contains(pendingDealData.formattedInterest);
		cy.get("[data-cy=deal-aspect-time-to-maturity]").contains(pendingDealData.formattedTTM);
	});
});
