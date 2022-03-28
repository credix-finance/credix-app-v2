import { utils } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";

export const encodeSeedString = (seedString: string) =>
	Buffer.from(utils.bytes.utf8.encode(seedString));

export const findSigningAuthorityPDA = (marketAddress: PublicKey, programId: PublicKey) => {
	const seed = [marketAddress.toBuffer()];
	return PublicKey.findProgramAddress(seed, programId);
};
