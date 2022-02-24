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
const web3_js_1 = require("@solana/web3.js");
const chai_1 = require("chai");
const sinon_1 = __importDefault(require("sinon"));
const src_1 = require("../src");
const pda_utils_1 = require("../src/utils/pda.utils");
const BorrowerInfo_fixture_1 = require("./fixtures/BorrowerInfo.fixture");
const Deal_fixture_1 = require("./fixtures/Deal.fixture");
const Market_fixture_1 = require("./fixtures/Market.fixture");
const util_1 = require("./util");
describe("Borrower", () => {
    const sandbox = sinon_1.default.createSandbox();
    afterEach(() => {
        sandbox.restore();
    });
    it("returns the correct market", () => __awaiter(void 0, void 0, void 0, function* () {
        const marketAddress = web3_js_1.Keypair.generate();
        const market = new src_1.Market(Market_fixture_1.globalMarketFixture, "market", util_1.testProgram, marketAddress.publicKey, util_1.testClient);
        const borrower = web3_js_1.Keypair.generate();
        const borrowerInfoAddress = web3_js_1.Keypair.generate();
        const borrowerInfo = new src_1.BorrowerInfo(BorrowerInfo_fixture_1.borrowerInfoFixture, market, borrowerInfoAddress.publicKey, borrower.publicKey, util_1.testClient);
        (0, chai_1.expect)(borrowerInfo.market).to.equal(market);
    }));
    it("returns the correct address", () => {
        const marketAddress = web3_js_1.Keypair.generate();
        const market = new src_1.Market(Market_fixture_1.globalMarketFixture, "market", util_1.testProgram, marketAddress.publicKey, util_1.testClient);
        const borrower = web3_js_1.Keypair.generate();
        const borrowerInfoAddress = web3_js_1.Keypair.generate();
        const borrowerInfo = new src_1.BorrowerInfo(BorrowerInfo_fixture_1.borrowerInfoFixture, market, borrowerInfoAddress.publicKey, borrower.publicKey, util_1.testClient);
        (0, chai_1.expect)(borrowerInfo.address.equals(borrowerInfoAddress.publicKey)).to.be.true;
    });
    it("returns the correct borrower key", () => {
        const marketAddress = web3_js_1.Keypair.generate();
        const market = new src_1.Market(Market_fixture_1.globalMarketFixture, "market", util_1.testProgram, marketAddress.publicKey, util_1.testClient);
        const borrower = web3_js_1.Keypair.generate();
        const borrowerInfoAddress = web3_js_1.Keypair.generate();
        const borrowerInfo = new src_1.BorrowerInfo(BorrowerInfo_fixture_1.borrowerInfoFixture, market, borrowerInfoAddress.publicKey, borrower.publicKey, util_1.testClient);
        (0, chai_1.expect)(borrowerInfo.borrower.equals(borrower.publicKey)).to.be.true;
    });
    it("returns the correct number of deals", () => {
        const marketAddress = web3_js_1.Keypair.generate();
        const market = new src_1.Market(Market_fixture_1.globalMarketFixture, "market", util_1.testProgram, marketAddress.publicKey, util_1.testClient);
        const borrower = web3_js_1.Keypair.generate();
        const borrowerInfoAddress = web3_js_1.Keypair.generate();
        const borrowerInfo = new src_1.BorrowerInfo(BorrowerInfo_fixture_1.borrowerInfoFixture, market, borrowerInfoAddress.publicKey, borrower.publicKey, util_1.testClient);
        (0, chai_1.expect)(borrowerInfo.numberOfDeals).to.equal(BorrowerInfo_fixture_1.borrowerInfoFixture.numOfDeals);
    });
    it("fetches a deal for a borrower", () => __awaiter(void 0, void 0, void 0, function* () {
        const marketAddress = web3_js_1.Keypair.generate();
        const market = new src_1.Market(Market_fixture_1.globalMarketFixture, "market", util_1.testProgram, marketAddress.publicKey, util_1.testClient);
        const borrower = web3_js_1.Keypair.generate();
        const borrowerInfoAddress = web3_js_1.Keypair.generate();
        const borrowerInfo = new src_1.BorrowerInfo(BorrowerInfo_fixture_1.borrowerInfoFixture, market, borrowerInfoAddress.publicKey, borrower.publicKey, util_1.testClient);
        const dealAddress = yield src_1.Deal.generatePDA(borrower.publicKey, 0, market);
        const getAccountInfoStub = sandbox.stub(util_1.testConnection, "getAccountInfo");
        getAccountInfoStub
            .withArgs(dealAddress[0])
            .returns(Promise.resolve((0, Deal_fixture_1.programDealFixture)(Object.assign(Object.assign({}, Deal_fixture_1.dealFixture), { borrower: borrower.publicKey, bump: dealAddress[1] }))));
        const deal = yield borrowerInfo.fetchDeal(0);
        (0, chai_1.expect)(deal === null || deal === void 0 ? void 0 : deal.address.equals(dealAddress[0])).to.be.true;
    }));
    it("fetches different deals based on their number", () => __awaiter(void 0, void 0, void 0, function* () {
        const marketAddress = web3_js_1.Keypair.generate();
        const market = new src_1.Market(Market_fixture_1.globalMarketFixture, "market", util_1.testProgram, marketAddress.publicKey, util_1.testClient);
        const borrower = web3_js_1.Keypair.generate();
        const borrowerInfoAddress = web3_js_1.Keypair.generate();
        const borrowerInfo = new src_1.BorrowerInfo(BorrowerInfo_fixture_1.borrowerInfoFixture, market, borrowerInfoAddress.publicKey, borrower.publicKey, util_1.testClient);
        const dealAddressA = yield src_1.Deal.generatePDA(borrower.publicKey, 0, market);
        const dealAddressB = yield src_1.Deal.generatePDA(borrower.publicKey, 1, market);
        const getAccountInfoStub = sandbox.stub(util_1.testConnection, "getAccountInfo");
        getAccountInfoStub.withArgs(dealAddressA[0]).returns(Promise.resolve((0, Deal_fixture_1.programDealFixture)(Object.assign(Object.assign({}, Deal_fixture_1.dealFixture), { borrower: borrower.publicKey, bump: dealAddressA[1], dealNumber: 0 }))));
        getAccountInfoStub.withArgs(dealAddressB[0]).returns(Promise.resolve((0, Deal_fixture_1.programDealFixture)(Object.assign(Object.assign({}, Deal_fixture_1.dealFixture), { borrower: borrower.publicKey, bump: dealAddressB[1], dealNumber: 1 }))));
        const dealA = yield borrowerInfo.fetchDeal(0);
        const dealB = yield borrowerInfo.fetchDeal(1);
        (0, chai_1.expect)(dealA === null || dealA === void 0 ? void 0 : dealA.address.equals(dealAddressA[0])).to.be.true;
        (0, chai_1.expect)(dealB === null || dealB === void 0 ? void 0 : dealB.address.equals(dealAddressB[0])).to.be.true;
        (0, chai_1.expect)(dealA === null || dealA === void 0 ? void 0 : dealA.number).to.equal(0);
        (0, chai_1.expect)(dealB === null || dealB === void 0 ? void 0 : dealB.number).to.equal(1);
        (0, chai_1.expect)(dealA === null || dealA === void 0 ? void 0 : dealA.address).to.not.equal(dealB === null || dealB === void 0 ? void 0 : dealB.address);
    }));
    it("generates a PDA", () => __awaiter(void 0, void 0, void 0, function* () {
        const marketAddress = web3_js_1.Keypair.generate();
        const market = new src_1.Market(Market_fixture_1.globalMarketFixture, "market", util_1.testProgram, marketAddress.publicKey, util_1.testClient);
        const borrower = web3_js_1.Keypair.generate();
        const pda = yield src_1.BorrowerInfo.generatePDA(borrower.publicKey, market);
        const seeds = [
            marketAddress.publicKey.toBuffer(),
            borrower.publicKey.toBuffer(),
            (0, pda_utils_1.encodeSeedString)("borrower-info"),
        ];
        const expected = yield web3_js_1.PublicKey.findProgramAddress(seeds, market.programId);
        (0, chai_1.expect)(pda[0].equals(expected[0])).to.be.true;
    }));
});
//# sourceMappingURL=Borrower.test.js.map