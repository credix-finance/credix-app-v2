import React from "react";
import renderer from "react-test-renderer";
import { MainMenu } from "@components/MainMenu";
import { WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

test("Main menu", () => {
	const component = renderer.create(
		<WalletProvider wallets={[]} autoConnect>
			<WalletModalProvider>
				<MainMenu />
			</WalletModalProvider>
		</WalletProvider>
	);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});
