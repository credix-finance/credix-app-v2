import React from "react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { IdentityButton, useGateway } from "@civic/solana-gateway-react";

export const CivicButton = () => {
	const wallet = useAnchorWallet();
	const { requestGatewayToken } = useGateway();

	if (!wallet?.publicKey) {
		return null;
	}

	return (
		<div className="identity-button">
			<IdentityButton onClick={requestGatewayToken} />
		</div>
	);
};
