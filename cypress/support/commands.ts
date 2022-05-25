Cypress.Commands.add("login", () => {
	let wallet;

	cy.visit("/");

	cy.window()
		.then((win) => {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			wallet = win.solana;
		})
		.then(() => wallet.connect());

	cy.visit("/");

	cy.connectWallet();
});

Cypress.Commands.add("connectWallet", () => {
	// Connect wallet
	cy.get("[data-cy=wallet-button]").click();

	// Choose phantom wallet
	cy.get(".wallet-adapter-button").first().click();

	// Close Civic modal
	// cy.get("[data-testid=TESTID_IFRAME_CLOSE_BTN]", {timeout: 20_000})
	// 	.click();
});
