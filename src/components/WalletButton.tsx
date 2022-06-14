import React, { useCallback, useMemo, useEffect } from "react";
import { useWalletModal, WalletIcon } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { useStore } from "@state/useStore";
import { Button } from "@components/Button";
import { Icon, IconDimension } from "@components/Icon";
import message from "@message";
import { useIntl } from "react-intl";
import { Menu, Dropdown } from "antd";
import { slicedBased58Key } from "@utils/format.utils";

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

		return slicedBased58Key(base58);
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
			<Menu.Item className="bg-credix-primary hover:bg-neutral-10" onClick={disconnectWallet}>
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
				size="large"
				onClick={(event) => event.preventDefault()}
				icon={<WalletIcon wallet={wallet} className="w-6" />}
				className={`${className} w-56`}
			>
				{address}
			</Button>
		</Dropdown>
	);
};
