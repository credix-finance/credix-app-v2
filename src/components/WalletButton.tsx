import React, { useCallback, useMemo, useState, useEffect, FunctionComponent } from "react";
import { useWalletModal, WalletIcon } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { useStore } from "@state/useStore";
import { Button } from "@components/Button";
import { Icon, IconDimension } from "@components/Icon";
import message from "@message";
import { useIntl } from "react-intl";

interface DropDownOptionProps {
	onClick: () => void;
	buttonText: string;
}

const DropDownOption: FunctionComponent<DropDownOptionProps> = ({ onClick, buttonText }) => {
	return (
		<div className="border-solid border-0">
			<Button
				type="default"
				className="w-full border-none bg-credix-primary hover:bg-neutral-10"
				onClick={onClick}
			>
				<span className="capitalize">{buttonText}</span>
			</Button>
		</div>
	);
};

interface WalletButtonProps {
	className?: string;
}

export const WalletButton = ({ className = "" }: WalletButtonProps) => {
	const { wallet, publicKey, disconnect } = useWallet();
	const { setVisible } = useWalletModal();
	const [dropdownVisible, setDropdownVisible] = useState(false);
	const base58 = useMemo(() => publicKey?.toBase58(), [publicKey]);
	const setIsAdmin = useStore((state) => state.setIsAdmin);
	const intl = useIntl();

	const address = useMemo(() => {
		if (!wallet || !base58) {
			return intl.formatMessage({
				defaultMessage: "Connecting",
				description: "WalletButton: connecting",
			});
		}

		return base58.slice(0, 5) + ".." + base58.slice(-5);
	}, [wallet, base58, intl]);

	const copyAddress = useCallback(async () => {
		if (base58) {
			try {
				await navigator.clipboard.writeText(base58);
				message.success({
					content: intl.formatMessage({
						defaultMessage: "Copied to clipboard!",
						description: "WalletButton: copy address success",
					}),
				});
			} catch {
				message.error({
					content: intl.formatMessage({
						defaultMessage: "Failed to copy address to clipboard",
						description: "WalletButton: copy address failed",
					}),
				});
			}
		}
	}, [base58, intl]);

	const disconnectWallet = async () => {
		try {
			await disconnect();
			message.success({
				content: intl.formatMessage({
					defaultMessage: "Wallet disconnected",
					description: "WalletButton: disconnect wallet success",
				}),
			});
		} catch {
			message.error({
				content: intl.formatMessage({
					defaultMessage: "Failed to disconnect wallet",
					description: "WalletButton: disconnect wallet failed",
				}),
			});
		}
	};

	useEffect(() => setIsAdmin(publicKey), [setIsAdmin, publicKey]);

	if (!wallet && !publicKey) {
		return (
			<Button
				size="large"
				onClick={() => setVisible(true)}
				icon={<Icon name="wallet" size={IconDimension.MIDDLE} />}
				className={className}
			>
				<span className="text-lg font-semibold capitalize">
					{intl.formatMessage({
						defaultMessage: "connect wallet",
						description: "WalletButton: connect button",
					})}
				</span>
			</Button>
		);
	}

	return (
		<div className="relative" onBlur={() => setTimeout(() => setDropdownVisible(false), 100)}>
			<Button
				type="default"
				size="large"
				onClick={() => setDropdownVisible(!dropdownVisible)}
				icon={<WalletIcon wallet={wallet} className="w-6" />}
				className={`${className} w-56`}
			>
				{address}
			</Button>
			<div
				className={`absolute top-[60px] z-10 whitespace-nowrap right-0 grid grid-cols-1 bg-credix-primary rounded-sm w-56 border border-solid border-neutral-100 divide-y divide-neutral-100 ${
					dropdownVisible ? "block" : "hidden"
				}`}
			>
				<DropDownOption
					onClick={copyAddress}
					buttonText={intl.formatMessage({
						defaultMessage: "copy address",
						description: "WalletButton: copy address button",
					})}
				/>
				<DropDownOption
					onClick={() => setVisible(true)}
					buttonText={intl.formatMessage({
						defaultMessage: "change wallet",
						description: "WalletButton: change wallet button",
					})}
				/>
				<DropDownOption
					onClick={disconnectWallet}
					buttonText={intl.formatMessage({
						defaultMessage: "disconnect",
						description: "WalletButton: disconnect button",
					})}
				/>
			</div>
		</div>
	);
};
