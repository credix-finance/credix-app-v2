import React, { useCallback, useMemo, useState } from "react";
import { useWalletModal, WalletIcon } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@components/Button";
import { Icon } from "@components/Icon";

interface WalletButtonProps {
	className?: string;
}

export const WalletButton = ({className = ""}: WalletButtonProps) => {
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
			<Button
				size="large"
				onClick={() => setVisible(true)}
				icon={<Icon name="wallet" className="w-6 h-6" />}
				className={className}
			>
				<span className="text-lg font-semibold">Connect Wallet</span>
			</Button>
		);
	}

	return (
		<div className="relative" onBlur={() => setTimeout(() => setDropdownVisible(false), 100)}>
			<Button
				type="default"
				onClick={() => setDropdownVisible(!dropdownVisible)}
				icon={<WalletIcon wallet={wallet} className="w-6" />}
				className={className}
			>
				{address}
			</Button>
			<div
				className={`absolute whitespace-nowrap right-0 grid grid-cols-1 bg-white rounded-sm w-56 border border-solid border-neutral-100 divide-y divide-neutral-100 ${
					dropdownVisible ? "block" : "hidden"
				}`}
			>
				<div className="border-solid border-0">
					<Button type="default" className="w-full border-none" onClick={copyAddress}>
						{/* TODO: add feedback when copied */}
						Copy Address
					</Button>
				</div>
				<div className="border-solid border-0">
					<Button type="default" className="w-full border-none" onClick={() => setVisible(true)}>
						Change Wallet
					</Button>
				</div>
				<div className="border-solid border-0">
					<Button type="default" className="w-full border-none" onClick={disconnect}>
						Disconnect
					</Button>
				</div>
			</div>
		</div>
	);
};
