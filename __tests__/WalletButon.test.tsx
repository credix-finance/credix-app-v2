import React from "react";
import renderer from "react-test-renderer";
import { WalletButton } from "@components/WalletButton";
import { WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

test("Wallet button", () => {
	const component = renderer.create(
		<WalletProvider wallets={[]} autoConnect>
			<WalletModalProvider>
				<WalletButton />
			</WalletModalProvider>
		</WalletProvider>
	);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});
