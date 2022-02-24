"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenAmountFixture = void 0;
const tokenAmountFixture = (amount, decimals) => {
    const uiAmount = amount / Math.pow(10, decimals);
    return {
        amount: amount.toString(),
        decimals: decimals,
        uiAmount: uiAmount,
        uiAmountString: uiAmount.toString(),
    };
};
exports.tokenAmountFixture = tokenAmountFixture;
//# sourceMappingURL=Token.fixture.js.map