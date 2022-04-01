import Big from "big.js";
import Fraction from "fraction.js";
import { Ratio as IDLRatio } from "../idl/idl.types";

export class Ratio {
	numerator: Big;
	denominator: Big;

	constructor(numerator: number, denominator: number) {
		this.numerator = new Big(numerator);
		this.denominator = new Big(denominator);
	}

	// TODO: do we want to expose a 'Big' interface or number interface?
	apply(to: number) {
		return Big(to).mul(this.numerator).div(this.denominator);
	}

	/**
	 * Helper function to convert this into something that is understandable program side
	 * @returns
	 */
	toIDLRatio(): IDLRatio {
		return { numerator: this.numerator.toNumber(), denominator: this.denominator.toNumber() };
	}

	// TODO: add tests
	equals(rhs: Ratio): boolean {
		return this.numerator.mul(rhs.denominator).eq(rhs.numerator.mul(this.denominator));
	}

	// TODO: add tests
	static fromNumber(n: number) {
		// TODO: can we do this without a dependency?
		const fraction = new Fraction(n);
		return new Ratio(fraction.n, fraction.d * 100);
	}
}
