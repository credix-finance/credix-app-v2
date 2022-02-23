import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Badge, GatewayStatus, IdentityButton, useGateway } from "@civic/solana-gateway-react";
import { PublicKey } from "@solana/web3.js";
import { config } from "../config";

interface CivicHeaderSectionProps {
	gatekeeperNetwork: PublicKey;
}

export const CivicHeaderSection = (props: CivicHeaderSectionProps) => {
	const wallet = useAnchorWallet();
	const { connection } = useConnection();
	const { gatewayStatus, requestGatewayToken } = useGateway();

	if (!wallet.publicKey) {
		return null;
	}

	return (
		<>
			{props.gatekeeperNetwork && (
				<div className={"header-button"}>
					<Badge
						clusterName={config.clusterConfig.name}
						gatekeeperNetwork={props.gatekeeperNetwork}
						publicKey={wallet.publicKey}
						connection={connection}
					/>
				</div>
			)}
			{gatewayStatus !== GatewayStatus.ACTIVE && (
				<div className={"header-button"}>
					<IdentityButton onClick={requestGatewayToken} />
				</div>
			)}
		</>
	);
};
