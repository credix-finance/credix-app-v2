Cypress.Commands.add("connectWallet", () => {
	// Connect wallet
	cy.get("[data-cy=wallet-button]").click();

	// Choose phantom wallet
	cy.get(".wallet-adapter-button").first().click();
});
