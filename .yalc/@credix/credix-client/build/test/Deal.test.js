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
const sinon_1 = __importDefault(require("sinon"));
const Market_fixture_1 = require("./fixtures/Market.fixture");
const util_1 = require("./util");
const Deal_fixture_1 = require("./fixtures/Deal.fixture");
const chai_1 = require("chai");
const anchor_1 = require("@project-serum/anchor");
const big_js_1 = __importDefault(require("big.js"));
const src_1 = require("../src");
const pda_utils_1 = require("../src/utils/pda.utils");
describe("Deal", () => {
    const sandbox = sinon_1.default.createSandbox();
    afterEach(() => {
        sandbox.restore();
    });
    it("returns the address", () => {
        const marketAddress = web3_js_1.Keypair.generate();
        const market = new src_1.Market(Market_fixture_1.globalMarketFixture, "market", util_1.testProgram, marketAddress.publicKey, util_1.testClient);
        const dealAddress = web3_js_1.Keypair.generate();
        const deal = new src_1.Deal(Deal_fixture_1.dealFixture, market, dealAddress.publicKey, util_1.testProgram, util_1.testClient);
        (0, chai_1.expect)(deal.address.equals(dealAddress.publicKey)).to.be.true;
    });
    it("returns the market", () => {
        const marketAddress = web3_js_1.Keypair.generate();
        const market = new src_1.Market(Market_fixture_1.globalMarketFixture, "market", util_1.testProgram, marketAddress.publicKey, util_1.testClient);
        const dealAddress = web3_js_1.Keypair.generate();
        const deal = new src_1.Deal(Deal_fixture_1.dealFixture, market, dealAddress.publicKey, util_1.testProgram, util_1.testClient);
        (0, chai_1.expect)(deal.market).to.equal(market);
    });
    it("generates a pda", () => __awaiter(void 0, void 0, void 0, function* () {
        const marketAddress = web3_js_1.Keypair.generate();
        const market = new src_1.Market(Market_fixture_1.globalMarketFixture, "market", util_1.testProgram, marketAddress.publicKey, util_1.testClient);
        const borrower = web3_js_1.Keypair.generate();
        const pda = yield src_1.Deal.generatePDA(borrower.publicKey, 0, market);
        const dealNumberSeed = new anchor_1.BN(0).toArrayLike(Buffer, "le", 2);
        const dealSeed = (0, pda_utils_1.encodeSeedString)("deal-info");
        const seed = [
            market.address.toBuffer(),
            borrower.publicKey.toBuffer(),
            dealNumberSeed,
            dealSeed,
        ];
        const expected = yield web3_js_1.PublicKey.findProgramAddress(seed, market.programId);
        (0, chai_1.expect)(pda[0].equals(expected[0])).to.be.true;
    }));
    it("returns the name", () => {
        const marketAddress = web3_js_1.Keypair.generate();
        const market = new src_1.Market(Market_fixture_1.globalMarketFixture, "market", util_1.testProgram, marketAddress.publicKey, util_1.testClient);
        const dealAddress = web3_js_1.Keypair.generate();
        const deal = new src_1.Deal(Deal_fixture_1.dealFixture, market, dealAddress.publicKey, util_1.testProgram, util_1.testClient);
        (0, chai_1.expect)(deal.name).to.equal(Deal_fixture_1.dealFixture.name);
    });
    it("returns the creation date timestamp", () => {
        const marketAddress = web3_js_1.Keypair.generate();
        const market = new src_1.Market(Market_fixture_1.globalMarketFixture, "market", util_1.testProgram, marketAddress.publicKey, util_1.testClient);
        const dealAddress = web3_js_1.Keypair.generate();
        const deal = new src_1.Deal(Deal_fixture_1.dealFixture, market, dealAddress.publicKey, util_1.testProgram, util_1.testClient);
        (0, chai_1.expect)(deal.createdAt).to.equal(Deal_fixture_1.dealFixture.createdAt.toNumber());
    });
    it("returns the leverage ratio", () => {
        const marketAddress = web3_js_1.Keypair.generate();
        const market = new src_1.Market(Market_fixture_1.globalMarketFixture, "market", util_1.testProgram, marketAddress.publicKey, util_1.testClient);
        const dealAddress = web3_js_1.Keypair.generate();
        const deal = new src_1.Deal(Deal_fixture_1.dealFixture, market, dealAddress.publicKey, util_1.testProgram, util_1.testClient);
        (0, chai_1.expect)(deal.leverageRatio).to.equal(Deal_fixture_1.dealFixture.leverageRatio);
    });
    it("returns the underwriter performance ratio", () => {
        const marketAddress = web3_js_1.Keypair.generate();
        const market = new src_1.Market(Market_fixture_1.globalMarketFixture, "market", util_1.testProgram, marketAddress.publicKey, util_1.testClient);
        const dealAddress = web3_js_1.Keypair.generate();
        const deal = new src_1.Deal(Deal_fixture_1.dealFixture, market, dealAddress.publicKey, util_1.testProgram, util_1.testClient);
        (0, chai_1.expect)(deal.underwriterPerformanceFeePercentage.denominator.eq(new big_js_1.default(Deal_fixture_1.dealFixture.underwriterPerformanceFeePercentage.denominator))).to.be.true;
        (0, chai_1.expect)(deal.underwriterPerformanceFeePercentage.numerator.eq(new big_js_1.default(Deal_fixture_1.dealFixture.underwriterPerformanceFeePercentage.numerator))).to.be.true;
    });
    it("returns the number", () => {
        const marketAddress = web3_js_1.Keypair.generate();
        const market = new src_1.Market(Market_fixture_1.globalMarketFixture, "market", util_1.testProgram, marketAddress.publicKey, util_1.testClient);
        const dealAddress = web3_js_1.Keypair.generate();
        const deal = new src_1.Deal(Deal_fixture_1.dealFixture, market, dealAddress.publicKey, util_1.testProgram, util_1.testClient);
        (0, chai_1.expect)(deal.number).to.equal(Deal_fixture_1.dealFixture.dealNumber);
    });
    it("returns the late fees", () => {
        const marketAddress = web3_js_1.Keypair.generate();
        const market = new src_1.Market(Market_fixture_1.globalMarketFixture, "market", util_1.testProgram, marketAddress.publicKey, util_1.testClient);
        const dealAddress = web3_js_1.Keypair.generate();
        const deal = new src_1.Deal(Deal_fixture_1.dealFixture, market, dealAddress.publicKey, util_1.testProgram, util_1.testClient);
        (0, chai_1.expect)(deal.lateFees).to.equal(Deal_fixture_1.dealFixture.lateFees.toNumber());
    });
    it("returns the late fees repaid", () => {
        const marketAddress = web3_js_1.Keypair.generate();
        const market = new src_1.Market(Market_fixture_1.globalMarketFixture, "market", util_1.testProgram, marketAddress.publicKey, util_1.testClient);
        const dealAddress = web3_js_1.Keypair.generate();
        const deal = new src_1.Deal(Deal_fixture_1.dealFixture, market, dealAddress.publicKey, util_1.testProgram, util_1.testClient);
        (0, chai_1.expect)(deal.lateFeesRepaid).to.equal(Deal_fixture_1.dealFixture.lateFeesRepaid.toNumber());
    });
    it("returns if the deal is private", () => {
        const marketAddress = web3_js_1.Keypair.generate();
        const market = new src_1.Market(Market_fixture_1.globalMarketFixture, "market", util_1.testProgram, marketAddress.publicKey, util_1.testClient);
        const dealAddress = web3_js_1.Keypair.generate();
        const deal = new src_1.Deal(Deal_fixture_1.dealFixture, market, dealAddress.publicKey, util_1.testProgram, util_1.testClient);
        (0, chai_1.expect)(deal.isPrivate).to.equal(Deal_fixture_1.dealFixture.private);
    });
    it("returns if the deal is defaulted", () => {
        const marketAddress = web3_js_1.Keypair.generate();
        const market = new src_1.Market(Market_fixture_1.globalMarketFixture, "market", util_1.testProgram, marketAddress.publicKey, util_1.testClient);
        const dealAddress = web3_js_1.Keypair.generate();
        const deal = new src_1.Deal(Deal_fixture_1.dealFixture, market, dealAddress.publicKey, util_1.testProgram, util_1.testClient);
        (0, chai_1.expect)(deal.defaulted).to.equal(Deal_fixture_1.dealFixture.defaulted);
    });
    it("returns the principal", () => {
        const marketAddress = web3_js_1.Keypair.generate();
        const market = new src_1.Market(Market_fixture_1.globalMarketFixture, "market", util_1.testProgram, marketAddress.publicKey, util_1.testClient);
        const dealAddress = web3_js_1.Keypair.generate();
        const deal = new src_1.Deal(Deal_fixture_1.dealFixture, market, dealAddress.publicKey, util_1.testProgram, util_1.testClient);
        (0, chai_1.expect)((0, big_js_1.default)(deal.principal).eq(new big_js_1.default(Deal_fixture_1.dealFixture.principal.toNumber()))).to.be.true;
    });
    it("returns principal repaid", () => {
        const marketAddress = web3_js_1.Keypair.generate();
        const market = new src_1.Market(Market_fixture_1.globalMarketFixture, "market", util_1.testProgram, marketAddress.publicKey, util_1.testClient);
        const dealAddress = web3_js_1.Keypair.generate();
        const deal = new src_1.Deal(Deal_fixture_1.dealFixture, market, dealAddress.publicKey, util_1.testProgram, util_1.testClient);
        (0, chai_1.expect)((0, big_js_1.default)(deal.principalAmountRepaid).eq(new big_js_1.default(Deal_fixture_1.dealFixture.principalAmountRepaid.toNumber()))).to.be.true;
    });
    it("returns principal principal to repay", () => {
        const marketAddress = web3_js_1.Keypair.generate();
        const market = new src_1.Market(Market_fixture_1.globalMarketFixture, "market", util_1.testProgram, marketAddress.publicKey, util_1.testClient);
        const dealAddress = web3_js_1.Keypair.generate();
        const deal = new src_1.Deal(Deal_fixture_1.dealFixture, market, dealAddress.publicKey, util_1.testProgram, util_1.testClient);
        const principal = new big_js_1.default(Deal_fixture_1.dealFixture.principal.toNumber());
        const principalAmountRepaid = new big_js_1.default(Deal_fixture_1.dealFixture.principalAmountRepaid.toNumber());
        (0, chai_1.expect)(deal.principalToRepay.eq(principal.sub(principalAmountRepaid))).to.be.true;
    });
    it("returns the interest repaid", () => {
        const marketAddress = web3_js_1.Keypair.generate();
        const market = new src_1.Market(Market_fixture_1.globalMarketFixture, "market", util_1.testProgram, marketAddress.publicKey, util_1.testClient);
        const dealAddress = web3_js_1.Keypair.generate();
        const deal = new src_1.Deal(Deal_fixture_1.dealFixture, market, dealAddress.publicKey, util_1.testProgram, util_1.testClient);
        (0, chai_1.expect)((0, big_js_1.default)(deal.interestRepaid).eq(new big_js_1.default(Deal_fixture_1.dealFixture.interestAmountRepaid.toNumber()))).to.be
            .true;
    });
    it("returns the financing fee percentage", () => {
        const marketAddress = web3_js_1.Keypair.generate();
        const market = new src_1.Market(Market_fixture_1.globalMarketFixture, "market", util_1.testProgram, marketAddress.publicKey, util_1.testClient);
        const dealAddress = web3_js_1.Keypair.generate();
        const deal = new src_1.Deal(Deal_fixture_1.dealFixture, market, dealAddress.publicKey, util_1.testProgram, util_1.testClient);
        (0, chai_1.expect)(deal.financingFeePercentage.numerator.eq(new big_js_1.default(Deal_fixture_1.dealFixture.financingFeePercentage.numerator))).to.be.true;
        (0, chai_1.expect)(deal.financingFeePercentage.denominator.eq(new big_js_1.default(Deal_fixture_1.dealFixture.financingFeePercentage.denominator))).to.be.true;
    });
    it("returns the time to maturity", () => {
        const marketAddress = web3_js_1.Keypair.generate();
        const market = new src_1.Market(Market_fixture_1.globalMarketFixture, "market", util_1.testProgram, marketAddress.publicKey, util_1.testClient);
        const dealAddress = web3_js_1.Keypair.generate();
        const deal = new src_1.Deal(Deal_fixture_1.dealFixture, market, dealAddress.publicKey, util_1.testProgram, util_1.testClient);
        (0, chai_1.expect)(deal.timeToMaturity).to.equal(Deal_fixture_1.dealFixture.timeToMaturityDays);
    });
    it("returns the go live at", () => {
        const marketAddress = web3_js_1.Keypair.generate();
        const market = new src_1.Market(Market_fixture_1.globalMarketFixture, "market", util_1.testProgram, marketAddress.publicKey, util_1.testClient);
        const dealAddress = web3_js_1.Keypair.generate();
        const deal = new src_1.Deal(Deal_fixture_1.dealFixture, market, dealAddress.publicKey, util_1.testProgram, util_1.testClient);
        (0, chai_1.expect)(deal.goLiveAt).to.equal(Deal_fixture_1.dealFixture.goLiveAt.toNumber());
    });
    it("has status closed when repaid", () => {
        const marketAddress = web3_js_1.Keypair.generate();
        const market = new src_1.Market(Market_fixture_1.globalMarketFixture, "market", util_1.testProgram, marketAddress.publicKey, util_1.testClient);
        const dealAddress = web3_js_1.Keypair.generate();
        const timeToMaturity = new src_1.Ratio(Deal_fixture_1.dealFixture.timeToMaturityDays, 360);
        const financingFeePercentage = new src_1.Ratio(Deal_fixture_1.dealFixture.financingFeePercentage.numerator, Deal_fixture_1.dealFixture.financingFeePercentage.denominator);
        const interest = financingFeePercentage.apply(Deal_fixture_1.dealFixture.principal.toNumber());
        const totalInterest = timeToMaturity.apply(interest.toNumber());
        const deal = new src_1.Deal(Object.assign(Object.assign({}, Deal_fixture_1.dealFixture), { principalAmountRepaid: Deal_fixture_1.dealFixture.principal, interestAmountRepaid: new anchor_1.BN(totalInterest.toNumber()) }), market, dealAddress.publicKey, util_1.testProgram, util_1.testClient);
        (0, chai_1.expect)(deal.status).to.equal(src_1.DealStatus.CLOSED);
    });
});
//# sourceMappingURL=Deal.test.js.map