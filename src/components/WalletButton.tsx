import { useWallet } from "@solana/wallet-adapter-react";
import React, { useCallback, useMemo, useState } from "react";
import { Button } from "@components/Button";
import { useWalletModal, WalletIcon } from "@solana/wallet-adapter-react-ui";
import { Icon } from "./Icon";

export const WalletButton = () => {
	const { wallet, publicKey, disconnect } = useWallet();
	const { setVisible } = useWalletModal();
	const [dropdownVisible, setDropdownVisible] = useState(false);
	const base58 = useMemo(() => publicKey?.toBase58(), [publicKey]);

	const address = useMemo(() => {
		if (!wallet || !base58) {
			return "Connecting";
		}

		return base58.slice(0, 4) + ".." + base58.slice(-4);
	}, [wallet, base58]);

	const copyAddress = useCallback(async () => {
		if (base58) {
			await navigator.clipboard.writeText(base58);
		}
	}, [base58]);

	if (!wallet && !publicKey) {
		return (
			<Button onClick={() => setVisible(true)} icon={<Icon name="wallet" />}>
				Connect Wallet
			</Button>
		);
	}

	return (
		<div className="relative" onBlur={() => setTimeout(() => setDropdownVisible(false), 100)}>
			<Button
				type="default"
				onClick={() => setDropdownVisible(!dropdownVisible)}
				icon={<WalletIcon wallet={wallet} className="w-6" />}
			>
				{address}
			</Button>
			<div
				className={`absolute whitespace-nowrap right-0 bg-credix-primary rounded-sm ${
					dropdownVisible ? "block" : "hidden"
				}`}
			>
				<Button type="default" className="w-full" onClick={copyAddress}>
					{/* TODO: add feedback when copied */}
					Copy Address
				</Button>
				<div className="border-x border-solid border-y-0 border-x-neutral-100">
					<Button type="default" className="w-full border-none" onClick={() => setVisible(true)}>
						Change Wallet
					</Button>
				</div>
				<Button type="default" className="w-full" onClick={disconnect}>
					Disconnect
				</Button>
			</div>
		</div>
	);
};
