import { PublicKey } from "@solana/web3.js";
import base58 from "bs58";
import nacl from "tweetnacl";

export const forceUint8Array = (key: Uint8Array | Buffer): Uint8Array => {
	if (key instanceof Uint8Array) {
		return key;
	}

	return Uint8Array.from(key);
};

const hashPublicKey = (publicKey: string) => {
	const pubKey = new PublicKey(publicKey);
	const pubkeyBytes = pubKey.toBytes();
	const hashedPublicKey = nacl.hash(forceUint8Array(pubkeyBytes));

	return hashedPublicKey;
};

/**
 * Helper function that can be used to create an encoded list of hashed
 * public keys to prevent leaking sensitive information.
 * @param keys
 * @returns base58 encoded list of hashed input
 */
export const encodePublicKeyList = (keys: string[]) => {
	return keys.map((key) => {
		const hashedKey = hashPublicKey(key);

		return base58.encode(hashedKey);
	});
};

export const verifyEncodedKey = (publicKey: PublicKey, encodedKey: string) => {
	const keyBytes = forceUint8Array(base58.decode(encodedKey));
	const hashedPublicKey = hashPublicKey(publicKey.toString());

	return nacl.verify(hashedPublicKey, keyBytes);
};
