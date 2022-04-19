import { Keypair } from "@solana/web3.js";
import { encodePublicKeyList, forceUint8Array, verifyEncodedKey } from "@utils/hash.utils";
import base58 from "bs58";

describe("forceUint8Array", () => {
	it("should return a uint8array when given a buffer", () => {
		const buffer = new Keypair().publicKey.toBuffer();

		expect(forceUint8Array(buffer)).toBeInstanceOf(Uint8Array);
	});

	it("should return a uint8array when given a uint8array", () => {
		const buffer = new Keypair().publicKey.toBytes();

		expect(forceUint8Array(buffer)).toBeInstanceOf(Uint8Array);
	});
});

describe("encodePublicKeyList", () => {
	it("should return an list of encoded public keys", () => {
		const keys = [new Keypair().publicKey.toString()];

		const encodedKeys = encodePublicKeyList(keys);

		expect(typeof encodedKeys[0]).toBe("string");
	});

	it("should be able to verify encoded string", () => {
		const keyPair = new Keypair();
		const encodedKeys = encodePublicKeyList([keyPair.publicKey.toString()]);

		expect(verifyEncodedKey(keyPair.publicKey, encodedKeys[0])).toBeTruthy();
	});
});
