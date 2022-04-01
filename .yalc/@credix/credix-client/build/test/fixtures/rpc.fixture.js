"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rpcResponseAndContextFixture = void 0;
const rpcResponseAndContextFixture = (response) => {
    return {
        context: {
            slot: 1,
        },
        value: response,
    };
};
exports.rpcResponseAndContextFixture = rpcResponseAndContextFixture;
//# sourceMappingURL=rpc.fixture.js.map