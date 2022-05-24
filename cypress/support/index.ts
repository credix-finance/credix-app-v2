import "./commands";
import { Keypair } from "@solana/web3.js";
import { PhantomWalletMock } from "phan-wallet-mock";
import { RPCEndpoint } from "../../src/types/solana.types";

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Cypress {
		interface Chainable {
			connectWallet(): Chainable<Element>;
		}
	}
}

Cypress.on("window:before:load", (win) => {
	const key = new Uint8Array(Cypress.env("MGMT_KEY"));
	const payer = Keypair.fromSecretKey(key);
	const wallet = PhantomWalletMock.create(RPCEndpoint.DEVNET, payer, "confirmed");

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	win.solana = wallet;
});

beforeEach(() => {
	// Cypress commands you would like to run before every single Cypress test.
});
