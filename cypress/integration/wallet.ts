beforeEach(() => {
	let wallet;

	cy.visit("http://localhost:3000/");

	cy.window()
		.then((win) => {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			wallet = win.solana;
		})
		.then(() => wallet.connect());

	cy.visit("http://localhost:3000/");

	cy.connectWallet();
});

describe("Wallet", () => {
	it("Connects to the wallet", () => {
		cy.get("[data-cy=wallet-address]").contains("Ej5");
	});

	it("Disconnects the wallet", () => {
		cy.get("[data-cy=wallet-address]").click();
		cy.get("[data-cy=disconnect-wallet-button]").click();
		cy.get(".ant-notification-notice-success").should("exist");
	});

	it("Copies the address", () => {
		cy.get("[data-cy=wallet-address]").click();
		cy.get("[data-cy=copy-address-button]").click();
		cy.get(".ant-notification-notice-success").should("exist");
		cy.window().then((win) => {
			win.navigator.clipboard.readText().then((text) => {
				expect(text).to.contain("Ej5");
			});
		});
	});
});
