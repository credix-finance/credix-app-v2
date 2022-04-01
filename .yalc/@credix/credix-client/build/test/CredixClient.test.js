"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon_1 = __importDefault(require("sinon"));
const Market_fixture_1 = require("./fixtures/Market.fixture");
const chai_solana_1 = require("@saberhq/chai-solana");
const util_1 = require("./util");
const CredixClient_1 = require("../src/rpc/CredixClient");
const nodewallet_1 = __importDefault(require("@project-serum/anchor/dist/cjs/nodewallet"));
const web3_js_1 = require("@solana/web3.js");
const src_1 = require("../src");
(0, chai_1.use)(chai_solana_1.chaiSolana);
describe("Credix Client", () => {
    const sandbox = sinon_1.default.createSandbox();
    const client = util_1.testClient;
    afterEach(() => {
        sandbox.restore();
    });
    it("can be instantiated", () => {
        (0, chai_1.expect)(client).to.exist;
    });
    it("uses default options if not provided", () => {
        // Arrange
        const config = {
            programId: util_1.testProgramId,
        };
        (0, chai_1.expect)(config.confirmOptions).to.be.undefined;
        // Act
        const wallet = new nodewallet_1.default(web3_js_1.Keypair.generate());
        const client = new CredixClient_1.CredixClient(util_1.testConnection, wallet, config);
        // Assert
        (0, chai_1.expect)(client).to.exist;
    });
    it("fetches a market", () => __awaiter(void 0, void 0, void 0, function* () {
        // Arrange
        const marketFixture = yield (0, Market_fixture_1.programMarketFixture)(Market_fixture_1.globalMarketFixture);
        const stub = sandbox.stub(util_1.testConnection, "getAccountInfo");
        stub.returns(Promise.resolve(marketFixture));
        // Act
        const market = yield client.fetchMarket("credix-marketplace");
        // Assert
        (0, chai_1.expect)(market === null || market === void 0 ? void 0 : market.name).to.equal("credix-marketplace");
        (0, chai_1.expect)(market === null || market === void 0 ? void 0 : market.programId.equals(util_1.testProgramId)).to.be.true;
    }));
    it("fetches different markets based on their name", () => __awaiter(void 0, void 0, void 0, function* () {
        // Arrange
        const marketAName = "market-a";
        const marketBName = "market-b";
        const marketALPTokenMintAccount = web3_js_1.Keypair.generate();
        const marketBLPTokenMintAccount = web3_js_1.Keypair.generate();
        const marketAData = Object.assign(Object.assign({}, Market_fixture_1.globalMarketFixture), { lpTokenMint: marketALPTokenMintAccount.publicKey });
        const marketBData = Object.assign(Object.assign({}, Market_fixture_1.globalMarketFixture), { lpTokenMint: marketBLPTokenMintAccount.publicKey });
        const marketAAccount = yield (0, Market_fixture_1.programMarketFixture)(marketAData);
        const marketBAccount = yield (0, Market_fixture_1.programMarketFixture)(marketBData);
        const marketAAddress = yield src_1.Market.generatePDA(marketAName, util_1.testProgramId);
        const marketBAddress = yield src_1.Market.generatePDA(marketBName, util_1.testProgramId);
        const stub = sandbox.stub(util_1.testConnection, "getAccountInfo");
        stub.withArgs(marketAAddress[0]).returns(Promise.resolve(marketAAccount));
        stub.withArgs(marketBAddress[0]).returns(Promise.resolve(marketBAccount));
        // Act
        const marketA = yield client.fetchMarket(marketAName);
        const marketB = yield client.fetchMarket(marketBName);
        // Assert
        (0, chai_1.expect)(marketA === null || marketA === void 0 ? void 0 : marketA.address.equals(marketAAddress[0])).to.be.true;
        (0, chai_1.expect)(marketB === null || marketB === void 0 ? void 0 : marketB.address.equals(marketBAddress[0])).to.be.true;
    }));
    it("returns null when market not found", () => __awaiter(void 0, void 0, void 0, function* () {
        // Arrange
        const stub = sandbox.stub(util_1.testConnection, "getAccountInfo");
        stub.returns(Promise.resolve(null));
        // Act
        const market = yield client.fetchMarket("credix-marketplace");
        // Assert
        (0, chai_1.expect)(market).to.be.null;
    }));
    it("returns the clustertime", () => __awaiter(void 0, void 0, void 0, function* () {
        // Arrange
        const getSlotStub = sandbox.stub(util_1.testConnection, "getSlot");
        getSlotStub.returns(Promise.resolve(1));
        const getBlockTimeStub = sandbox.stub(util_1.testConnection, "getBlockTime");
        getBlockTimeStub.returns(Promise.resolve(2));
        // Act
        const clusterTime = yield client.getClusterTime();
        // Assert
        (0, chai_1.expect)(clusterTime).to.equal(2);
    }));
    it("returns a fallback if no clusterTime", () => __awaiter(void 0, void 0, void 0, function* () {
        // Arrange
        const getSlotStub = sandbox.stub(util_1.testConnection, "getSlot");
        getSlotStub.returns(Promise.resolve(1));
        const getBlockTimeStub = sandbox.stub(util_1.testConnection, "getBlockTime");
        getBlockTimeStub.returns(Promise.resolve(null));
        const nowStub = sandbox.stub(Date, "now");
        nowStub.returns(1644812912990000);
        // Act
        const clusterTime = yield client.getClusterTime(true);
        // Assert
        (0, chai_1.expect)(clusterTime).to.equal(Date.now() * 1000);
    }));
    it("returns null if no clustertime and no fallback", () => __awaiter(void 0, void 0, void 0, function* () {
        // Arrange
        const getSlotStub = sandbox.stub(util_1.testConnection, "getSlot");
        getSlotStub.returns(Promise.resolve(1));
        const getBlockTimeStub = sandbox.stub(util_1.testConnection, "getBlockTime");
        getBlockTimeStub.returns(Promise.resolve(null));
        // Act
        const clusterTime = yield client.getClusterTime();
        // Assert
        (0, chai_1.expect)(clusterTime).to.be.null;
    }));
});
//# sourceMappingURL=CredixClient.test.js.map