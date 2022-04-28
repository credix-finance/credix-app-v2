Cypress.Commands.add("connectWallet", () => {
	// Connect wallet
	cy.get("[data-cy=wallet-button]")
		.click();

	// Choose phantom wallet
	cy.get(".wallet-adapter-button")
		.first()
		.click();

	// Close Civic modal
	cy.get("[data-testid=TESTID_IFRAME_CLOSE_BTN]", {timeout: 20_000})
		.click();
});
