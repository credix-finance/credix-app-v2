import React, { useCallback, useMemo, useEffect } from "react";
import { useWalletModal, WalletIcon } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { useStore } from "@state/useStore";
import { Button } from "@components/Button";
import { Icon, IconDimension } from "@components/Icon";
import { useIntl } from "react-intl";
import { Menu, Dropdown } from "antd";
import notification from "@notification";

interface WalletButtonProps {
	className?: string;
}

export const WalletButton = ({ className = "" }: WalletButtonProps) => {
	const { wallet, publicKey, disconnect } = useWallet();
	const { setVisible } = useWalletModal();
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
				notification.success({
					message: intl.formatMessage({
						defaultMessage: "Copied to clipboard!",
						description: "WalletButton: copy address success",
					}),
				});
			} catch (error) {
				notification.error({
					message: intl.formatMessage({
						defaultMessage: "Failed to copy address to clipboard",
						description: "WalletButton: copy address failed",
					}),
					error,
				});
			}
		}
	}, [base58, intl]);

	const disconnectWallet = async () => {
		try {
			await disconnect();
			notification.success({
				message: intl.formatMessage({
					defaultMessage: "Wallet disconnected",
					description: "WalletButton: disconnect wallet success",
				}),
			});
		} catch (error) {
			notification.error({
				message: intl.formatMessage({
					defaultMessage: "Failed to disconnect wallet",
					description: "WalletButton: disconnect wallet failed",
				}),
				error,
			});
		}
	};

	useEffect(() => setIsAdmin(publicKey), [setIsAdmin, publicKey]);

	if (!wallet && !publicKey) {
		return (
			<Button
				onClick={() => setVisible(true)}
				icon={<Icon name="wallet" size={IconDimension.MIDDLE} />}
				className={className}
				data-cy="wallet-button"
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

	const menu = (
		<Menu className="bg-credix-primary shadow-none border-solid border-[1px]">
			<Menu.Item className="bg-credix-primary hover:bg-neutral-10" onClick={copyAddress}>
				{intl.formatMessage({
					defaultMessage: "copy address",
					description: "WalletButton: copy address button",
				})}
			</Menu.Item>
			<Menu.Item className="bg-credix-primary hover:bg-neutral-10" onClick={() => setVisible(true)}>
				{intl.formatMessage({
					defaultMessage: "change wallet",
					description: "WalletButton: change wallet button",
				})}
			</Menu.Item>
			<Menu.Item
				data-cy="disconnect-wallet-button"
				className="bg-credix-primary hover:bg-neutral-10"
				onClick={disconnectWallet}
			>
				{intl.formatMessage({
					defaultMessage: "disconnect",
					description: "WalletButton: disconnect button",
				})}
			</Menu.Item>
		</Menu>
	);

	return (
		<Dropdown overlay={menu} trigger={["click"]}>
			<Button
				type="default"
				onClick={(event) => event.preventDefault()}
				icon={<WalletIcon wallet={wallet} className="w-6" />}
				className={`${className} w-56`}
			>
				<span data-cy="wallet-address">{address}</span>
			</Button>
		</Dropdown>
	);
};
