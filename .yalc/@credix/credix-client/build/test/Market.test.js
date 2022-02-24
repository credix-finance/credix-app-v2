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
const chai_solana_1 = require("@saberhq/chai-solana");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const big_js_1 = __importDefault(require("big.js"));
const chai_1 = require("chai");
const sinon_1 = __importDefault(require("sinon"));
const src_1 = require("../src");
const BorrowerInfo_fixture_1 = require("./fixtures/BorrowerInfo.fixture");
const CredixPass_fixture_1 = require("./fixtures/CredixPass.fixture");
const Deal_fixture_1 = require("./fixtures/Deal.fixture");
const Market_fixture_1 = require("./fixtures/Market.fixture");
const rpc_fixture_1 = require("./fixtures/rpc.fixture");
const Token_fixture_1 = require("./fixtures/Token.fixture");
const util_1 = require("./util");
(0, chai_1.use)(chai_solana_1.chaiSolana);
describe("Market", () => __awaiter(void 0, void 0, void 0, function* () {
    const sandbox = sinon_1.default.createSandbox();
    afterEach(() => {
        sandbox.restore();
    });
    it("should have the correct name", () => __awaiter(void 0, void 0, void 0, function* () {
        // Arrange
        const marketFixture = yield (0, Market_fixture_1.programMarketFixture)(Market_fixture_1.globalMarketFixture);
        const stub = sandbox.stub(util_1.testConnection, "getAccountInfo");
        stub.returns(Promise.resolve(marketFixture));
        const marketName = "credix-marketplace";
        // Act
        const market = yield util_1.testClient.fetchMarket(marketName);
        // Assert
        (0, chai_1.expect)(market === null || market === void 0 ? void 0 : market.name).to.equal(marketName);
    }));
    it("should have the correct address", () => __awaiter(void 0, void 0, void 0, function* () {
        // Arrange
        const marketFixture = yield (0, Market_fixture_1.programMarketFixture)(Market_fixture_1.globalMarketFixture);
        const stub = sandbox.stub(util_1.testConnection, "getAccountInfo");
        stub.returns(Promise.resolve(marketFixture));
        const marketName = "credix-marketplace";
        // Act
        const market = yield util_1.testClient.fetchMarket(marketName);
        // Assert
        const [marketAddress] = yield src_1.Market.generatePDA(marketName, util_1.testProgramId);
        (0, chai_1.expect)(market === null || market === void 0 ? void 0 : market.address).to.eqAddress(marketAddress);
    }));
    it("returns the program id", () => __awaiter(void 0, void 0, void 0, function* () {
        // Arrange
        const marketFixture = yield (0, Market_fixture_1.programMarketFixture)(Market_fixture_1.globalMarketFixture);
        const stub = sandbox.stub(util_1.testConnection, "getAccountInfo");
        stub.returns(Promise.resolve(marketFixture));
        const marketName = "credix-marketplace";
        const market = yield util_1.testClient.fetchMarket(marketName);
        // Act
        const programId = market === null || market === void 0 ? void 0 : market.programId;
        // Assert
        (0, chai_1.expect)(programId === null || programId === void 0 ? void 0 : programId.equals(util_1.testProgramId)).to.be.true;
    }));
    it("returns the base mint public key", () => __awaiter(void 0, void 0, void 0, function* () {
        // Arrange
        const marketFixture = yield (0, Market_fixture_1.programMarketFixture)(Market_fixture_1.globalMarketFixture);
        const stub = sandbox.stub(util_1.testConnection, "getAccountInfo");
        stub.returns(Promise.resolve(marketFixture));
        const marketName = "credix-marketplace";
        const market = yield util_1.testClient.fetchMarket(marketName);
        // Act
        const baseMintPK = market === null || market === void 0 ? void 0 : market.baseMintPK;
        // Assert
        (0, chai_1.expect)(baseMintPK === null || baseMintPK === void 0 ? void 0 : baseMintPK.equals(Market_fixture_1.globalMarketFixture.liquidityPoolTokenMintAccount)).to.be.true;
    }));
    it("returns the lp mint public key", () => __awaiter(void 0, void 0, void 0, function* () {
        // Arrange
        const marketFixture = yield (0, Market_fixture_1.programMarketFixture)(Market_fixture_1.globalMarketFixture);
        const stub = sandbox.stub(util_1.testConnection, "getAccountInfo");
        stub.returns(Promise.resolve(marketFixture));
        const marketName = "credix-marketplace";
        const market = yield util_1.testClient.fetchMarket(marketName);
        // Act
        const lpMintPK = market === null || market === void 0 ? void 0 : market.lpMintPK;
        // Assert
        (0, chai_1.expect)(lpMintPK === null || lpMintPK === void 0 ? void 0 : lpMintPK.equals(Market_fixture_1.globalMarketFixture.lpTokenMintAccount)).to.be.true;
    }));
    it("returns the treasury public key", () => __awaiter(void 0, void 0, void 0, function* () {
        // Arrange
        const marketFixture = yield (0, Market_fixture_1.programMarketFixture)(Market_fixture_1.globalMarketFixture);
        const stub = sandbox.stub(util_1.testConnection, "getAccountInfo");
        stub.returns(Promise.resolve(marketFixture));
        const marketName = "credix-marketplace";
        const market = yield util_1.testClient.fetchMarket(marketName);
        // Act
        const treasury = market === null || market === void 0 ? void 0 : market.treasury;
        // Assert
        (0, chai_1.expect)(treasury === null || treasury === void 0 ? void 0 : treasury.equals(Market_fixture_1.globalMarketFixture.treasuryPoolTokenAccount)).to.be.true;
    }));
    it("returns the withdraw fee", () => __awaiter(void 0, void 0, void 0, function* () {
        // Arrange
        const marketFixture = yield (0, Market_fixture_1.programMarketFixture)(Market_fixture_1.globalMarketFixture);
        const stub = sandbox.stub(util_1.testConnection, "getAccountInfo");
        stub.returns(Promise.resolve(marketFixture));
        const marketName = "credix-marketplace";
        const market = yield util_1.testClient.fetchMarket(marketName);
        // Act
        const withdrawFee = market === null || market === void 0 ? void 0 : market.withdrawFee;
        // Assert
        (0, chai_1.expect)(withdrawFee === null || withdrawFee === void 0 ? void 0 : withdrawFee.numerator).to.equal(Market_fixture_1.globalMarketFixture.withdrawalFee.numerator);
        (0, chai_1.expect)(withdrawFee === null || withdrawFee === void 0 ? void 0 : withdrawFee.denominator).to.equal(Market_fixture_1.globalMarketFixture.withdrawalFee.denominator);
    }));
    it("returns the interest fee", () => __awaiter(void 0, void 0, void 0, function* () {
        // Arrange
        const marketFixture = yield (0, Market_fixture_1.programMarketFixture)(Market_fixture_1.globalMarketFixture);
        const stub = sandbox.stub(util_1.testConnection, "getAccountInfo");
        stub.returns(Promise.resolve(marketFixture));
        const marketName = "credix-marketplace";
        const market = yield util_1.testClient.fetchMarket(marketName);
        // Act
        const interestFee = market === null || market === void 0 ? void 0 : market.interestFee;
        // Assert
        (0, chai_1.expect)(interestFee === null || interestFee === void 0 ? void 0 : interestFee.numerator).to.equal(Market_fixture_1.globalMarketFixture.interestFee.numerator);
        (0, chai_1.expect)(interestFee === null || interestFee === void 0 ? void 0 : interestFee.denominator).to.equal(Market_fixture_1.globalMarketFixture.interestFee.denominator);
    }));
    it("returns the lp supply", () => __awaiter(void 0, void 0, void 0, function* () {
        // Arrange
        const marketFixture = yield (0, Market_fixture_1.programMarketFixture)(Market_fixture_1.globalMarketFixture);
        const getAccountInfoStub = sandbox.stub(util_1.testConnection, "getAccountInfo");
        const getTokenSupplyStub = sandbox.stub(util_1.testConnection, "getTokenSupply");
        getAccountInfoStub.returns(Promise.resolve(marketFixture));
        getTokenSupplyStub.returns(Promise.resolve((0, rpc_fixture_1.rpcResponseAndContextFixture)((0, Token_fixture_1.tokenAmountFixture)(100, 6))));
        const marketName = "credix-marketplace";
        const market = yield util_1.testClient.fetchMarket(marketName);
        if (!market) {
            throw new Error();
        }
        // Act
        const lpSupply = yield market.getLPSupply();
        // Assert'
        (0, chai_1.expect)(Number(lpSupply.amount)).to.equal(100);
    }));
    it("calculates the TVL", () => __awaiter(void 0, void 0, void 0, function* () {
        // Arrange
        const marketFixture = yield (0, Market_fixture_1.programMarketFixture)(Market_fixture_1.globalMarketFixture);
        const getAccountInfoStub = sandbox.stub(util_1.testConnection, "getAccountInfo");
        getAccountInfoStub.returns(Promise.resolve(marketFixture));
        const marketName = "credix-marketplace";
        const market = yield util_1.testClient.fetchMarket(marketName);
        if (!market) {
            throw new Error();
        }
        const liquidityPoolBaseTokenAccountPK = yield (market === null || market === void 0 ? void 0 : market.findLiquidityPoolTokenAccount());
        const getTokenAccountBalanceStub = sandbox.stub(util_1.testConnection, "getTokenAccountBalance");
        getTokenAccountBalanceStub
            .withArgs(liquidityPoolBaseTokenAccountPK)
            .returns(Promise.resolve((0, rpc_fixture_1.rpcResponseAndContextFixture)((0, Token_fixture_1.tokenAmountFixture)(10, 6))));
        // Act
        const tvl = yield market.calculateTVL();
        // Assert
        const totalOutstandingCredit = market.totalOutstandingCredit;
        const liquidityPoolBalance = yield market.fetchLiquidityPoolBalance();
        const expectedTVL = new big_js_1.default(liquidityPoolBalance.amount).add(totalOutstandingCredit);
        (0, chai_1.expect)(tvl.toNumber()).to.equal(expectedTVL.toNumber());
    }));
    it("fetches the liquidity pool balance", () => __awaiter(void 0, void 0, void 0, function* () {
        // Arrange
        const marketFixture = yield (0, Market_fixture_1.programMarketFixture)(Market_fixture_1.globalMarketFixture);
        const getAccountInfoStub = sandbox.stub(util_1.testConnection, "getAccountInfo");
        getAccountInfoStub.returns(Promise.resolve(marketFixture));
        const marketName = "credix-marketplace";
        const market = yield util_1.testClient.fetchMarket(marketName);
        if (!market) {
            throw new Error();
        }
        const liquidityPoolBaseTokenAccountPK = yield (market === null || market === void 0 ? void 0 : market.findLiquidityPoolTokenAccount());
        const getTokenAccountBalanceStub = sandbox.stub(util_1.testConnection, "getTokenAccountBalance");
        getTokenAccountBalanceStub
            .withArgs(liquidityPoolBaseTokenAccountPK)
            .returns(Promise.resolve((0, rpc_fixture_1.rpcResponseAndContextFixture)((0, Token_fixture_1.tokenAmountFixture)(10, 6))));
        // Act
        const liquidityPoolBalance = yield market.fetchLiquidityPoolBalance();
        // Assert
        (0, chai_1.expect)(Number(liquidityPoolBalance.amount)).to.equal(10);
    }));
    it("returns the LP price", () => __awaiter(void 0, void 0, void 0, function* () {
        // Arrange
        const marketFixture = yield (0, Market_fixture_1.programMarketFixture)(Market_fixture_1.globalMarketFixture);
        const getAccountInfoStub = sandbox.stub(util_1.testConnection, "getAccountInfo");
        getAccountInfoStub.returns(Promise.resolve(marketFixture));
        const marketName = "credix-marketplace";
        const market = yield util_1.testClient.fetchMarket(marketName);
        if (!market) {
            throw new Error();
        }
        const liquidityPoolBaseTokenAccountPK = yield (market === null || market === void 0 ? void 0 : market.findLiquidityPoolTokenAccount());
        const getTokenAccountBalanceStub = sandbox.stub(util_1.testConnection, "getTokenAccountBalance");
        getTokenAccountBalanceStub
            .withArgs(liquidityPoolBaseTokenAccountPK)
            .returns(Promise.resolve((0, rpc_fixture_1.rpcResponseAndContextFixture)((0, Token_fixture_1.tokenAmountFixture)(10, 6))));
        const getTokenSupplyStub = sandbox.stub(util_1.testConnection, "getTokenSupply");
        getTokenSupplyStub.returns(Promise.resolve((0, rpc_fixture_1.rpcResponseAndContextFixture)((0, Token_fixture_1.tokenAmountFixture)(100, 6))));
        // Act
        const lpPrice = yield market.getLPPrice();
        // Assert
        const tvl = yield market.calculateTVL();
        (0, chai_1.expect)(lpPrice.eq(tvl.div(new big_js_1.default(100)))).to.be.true;
    }));
    it("returns the LP price 0 when no supply yet", () => __awaiter(void 0, void 0, void 0, function* () {
        // Arrange
        const marketFixture = yield (0, Market_fixture_1.programMarketFixture)(Market_fixture_1.globalMarketFixture);
        const getAccountInfoStub = sandbox.stub(util_1.testConnection, "getAccountInfo");
        getAccountInfoStub.returns(Promise.resolve(marketFixture));
        const marketName = "credix-marketplace";
        const market = yield util_1.testClient.fetchMarket(marketName);
        if (!market) {
            throw new Error();
        }
        const liquidityPoolBaseTokenAccountPK = yield (market === null || market === void 0 ? void 0 : market.findLiquidityPoolTokenAccount());
        const getTokenAccountBalanceStub = sandbox.stub(util_1.testConnection, "getTokenAccountBalance");
        getTokenAccountBalanceStub
            .withArgs(liquidityPoolBaseTokenAccountPK)
            .returns(Promise.resolve((0, rpc_fixture_1.rpcResponseAndContextFixture)((0, Token_fixture_1.tokenAmountFixture)(10, 6))));
        const getTokenSupplyStub = sandbox.stub(util_1.testConnection, "getTokenSupply");
        getTokenSupplyStub.returns(Promise.resolve((0, rpc_fixture_1.rpcResponseAndContextFixture)((0, Token_fixture_1.tokenAmountFixture)(0, 6))));
        // Act
        const lpPrice = yield market.getLPPrice();
        // Assert
        (0, chai_1.expect)(lpPrice.eq(0)).to.be.true;
    }));
    it("finds a base token account", () => __awaiter(void 0, void 0, void 0, function* () {
        // Arrange
        const marketFixture = yield (0, Market_fixture_1.programMarketFixture)(Market_fixture_1.globalMarketFixture);
        const getAccountInfoStub = sandbox.stub(util_1.testConnection, "getAccountInfo");
        getAccountInfoStub.returns(Promise.resolve(marketFixture));
        const marketName = "credix-marketplace";
        const market = yield util_1.testClient.fetchMarket(marketName);
        if (!market) {
            throw new Error();
        }
        const pk = web3_js_1.Keypair.generate().publicKey;
        // Act
        const baseTokenAccount = yield market.findBaseTokenAccount(pk);
        // Assert
        const expected = yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, market.baseMintPK, pk, false);
        (0, chai_1.expect)(baseTokenAccount.equals(expected)).to.be.true;
    }));
    it("finds an off curve base token account", () => __awaiter(void 0, void 0, void 0, function* () {
        // Arrange
        const marketFixture = yield (0, Market_fixture_1.programMarketFixture)(Market_fixture_1.globalMarketFixture);
        const getAccountInfoStub = sandbox.stub(util_1.testConnection, "getAccountInfo");
        getAccountInfoStub.returns(Promise.resolve(marketFixture));
        const marketName = "credix-marketplace";
        const market = yield util_1.testClient.fetchMarket(marketName);
        if (!market) {
            throw new Error();
        }
        // Act
        const baseTokenAccount = yield market.findBaseTokenAccount(market.address);
        // Assert
        const expected = yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, market.baseMintPK, market.address, true);
        (0, chai_1.expect)(baseTokenAccount.equals(expected)).to.be.true;
    }));
    it("finds a lp token account", () => __awaiter(void 0, void 0, void 0, function* () {
        // Arrange
        const marketFixture = yield (0, Market_fixture_1.programMarketFixture)(Market_fixture_1.globalMarketFixture);
        const getAccountInfoStub = sandbox.stub(util_1.testConnection, "getAccountInfo");
        getAccountInfoStub.returns(Promise.resolve(marketFixture));
        const marketName = "credix-marketplace";
        const market = yield util_1.testClient.fetchMarket(marketName);
        if (!market) {
            throw new Error();
        }
        const pk = web3_js_1.Keypair.generate().publicKey;
        // Act
        const baseTokenAccount = yield market.findLPTokenAccount(pk);
        // Assert
        const expected = yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, market.lpMintPK, pk, false);
        (0, chai_1.expect)(baseTokenAccount.equals(expected)).to.be.true;
    }));
    it("finds an off curve lp token account", () => __awaiter(void 0, void 0, void 0, function* () {
        // Arrange
        const marketFixture = yield (0, Market_fixture_1.programMarketFixture)(Market_fixture_1.globalMarketFixture);
        const getAccountInfoStub = sandbox.stub(util_1.testConnection, "getAccountInfo");
        getAccountInfoStub.returns(Promise.resolve(marketFixture));
        const marketName = "credix-marketplace";
        const market = yield util_1.testClient.fetchMarket(marketName);
        if (!market) {
            throw new Error();
        }
        // Act
        const baseTokenAccount = yield market.findLPTokenAccount(market.address);
        // Assert
        const expected = yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, market.lpMintPK, market.address, true);
        (0, chai_1.expect)(baseTokenAccount.equals(expected)).to.be.true;
    }));
    it("returns the user base balance", () => __awaiter(void 0, void 0, void 0, function* () {
        // Arrange
        const marketFixture = yield (0, Market_fixture_1.programMarketFixture)(Market_fixture_1.globalMarketFixture);
        const getAccountInfoStub = sandbox.stub(util_1.testConnection, "getAccountInfo");
        getAccountInfoStub.returns(Promise.resolve(marketFixture));
        const marketName = "credix-marketplace";
        const market = yield util_1.testClient.fetchMarket(marketName);
        if (!market) {
            throw new Error();
        }
        const user = web3_js_1.Keypair.generate().publicKey;
        const userBaseTokenAccount = yield market.findBaseTokenAccount(user);
        const getTokenAccountBalanceStub = sandbox.stub(util_1.testConnection, "getTokenAccountBalance");
        getTokenAccountBalanceStub
            .withArgs(userBaseTokenAccount)
            .returns(Promise.resolve((0, rpc_fixture_1.rpcResponseAndContextFixture)((0, Token_fixture_1.tokenAmountFixture)(999, 6))));
        // Act
        const amount = yield market.userBaseBalance(user);
        // Assert
        (0, chai_1.expect)(amount.amount).to.equal("999");
    }));
    it("returns the user lp balance", () => __awaiter(void 0, void 0, void 0, function* () {
        // Arrange
        const marketFixture = yield (0, Market_fixture_1.programMarketFixture)(Market_fixture_1.globalMarketFixture);
        const getAccountInfoStub = sandbox.stub(util_1.testConnection, "getAccountInfo");
        getAccountInfoStub.returns(Promise.resolve(marketFixture));
        const marketName = "credix-marketplace";
        const market = yield util_1.testClient.fetchMarket(marketName);
        if (!market) {
            throw new Error();
        }
        const user = web3_js_1.Keypair.generate().publicKey;
        const userLPTokenAccount = yield market.findLPTokenAccount(user);
        const getTokenAccountBalanceStub = sandbox.stub(util_1.testConnection, "getTokenAccountBalance");
        getTokenAccountBalanceStub
            .withArgs(userLPTokenAccount)
            .returns(Promise.resolve((0, rpc_fixture_1.rpcResponseAndContextFixture)((0, Token_fixture_1.tokenAmountFixture)(999, 6))));
        // Act
        const amount = yield market.userLPBalance(user);
        // Assert
        (0, chai_1.expect)(amount.amount).to.equal("999");
    }));
    it("returns the total outstanding credit", () => __awaiter(void 0, void 0, void 0, function* () {
        // Arrange
        const marketFixture = yield (0, Market_fixture_1.programMarketFixture)(Market_fixture_1.globalMarketFixture);
        const getAccountInfoStub = sandbox.stub(util_1.testConnection, "getAccountInfo");
        getAccountInfoStub.returns(Promise.resolve(marketFixture));
        const marketName = "credix-marketplace";
        const market = yield util_1.testClient.fetchMarket(marketName);
        if (!market) {
            throw new Error();
        }
        // Act
        const totalOutstandingCredit = market.totalOutstandingCredit;
        // Assert
        (0, chai_1.expect)(totalOutstandingCredit.eq(new big_js_1.default(Market_fixture_1.globalMarketFixture.totalOutstandingCredit.toNumber()))).to.be.true;
    }));
    it("returns the gatekeeper network", () => __awaiter(void 0, void 0, void 0, function* () {
        // Arrange
        const marketFixture = yield (0, Market_fixture_1.programMarketFixture)(Market_fixture_1.globalMarketFixture);
        const getAccountInfoStub = sandbox.stub(util_1.testConnection, "getAccountInfo");
        getAccountInfoStub.returns(Promise.resolve(marketFixture));
        const marketName = "credix-marketplace";
        const market = yield util_1.testClient.fetchMarket(marketName);
        if (!market) {
            throw new Error();
        }
        // Act
        const gatekeeperNetwork = market.gateKeeperNetwork;
        // Assert
        (0, chai_1.expect)(gatekeeperNetwork.equals(Market_fixture_1.globalMarketFixture.gatekeeperNetwork)).to.be.true;
    }));
    it("fetches borrower info", () => __awaiter(void 0, void 0, void 0, function* () {
        // Arrange
        const marketFixture = yield (0, Market_fixture_1.programMarketFixture)(Market_fixture_1.globalMarketFixture);
        const marketName = "credix-marketplace";
        const marketAddress = yield src_1.Market.generatePDA(marketName, util_1.testProgramId);
        const getAccountInfoStub = sandbox.stub(util_1.testConnection, "getAccountInfo");
        getAccountInfoStub.withArgs(marketAddress[0]).returns(Promise.resolve(marketFixture));
        const market = yield util_1.testClient.fetchMarket(marketName);
        if (!market) {
            throw new Error();
        }
        const borrower = web3_js_1.Keypair.generate();
        const borrowerInfoAddress = yield src_1.BorrowerInfo.generatePDA(borrower.publicKey, market);
        const borrowerFixture = yield (0, BorrowerInfo_fixture_1.programBorrowerInfoFixture)(Object.assign(Object.assign({}, BorrowerInfo_fixture_1.borrowerInfoFixture), { bump: borrowerInfoAddress[1] }));
        getAccountInfoStub.withArgs(borrowerInfoAddress[0]).returns(Promise.resolve(borrowerFixture));
        // Act
        const borrowerInfo = yield market.fetchBorrowerInfo(borrower.publicKey);
        // Assert
        (0, chai_1.expect)(borrowerInfo === null || borrowerInfo === void 0 ? void 0 : borrowerInfo.address.equals(borrowerInfoAddress[0])).to.be.true;
        (0, chai_1.expect)(borrowerInfo === null || borrowerInfo === void 0 ? void 0 : borrowerInfo.borrower.equals(borrower.publicKey)).to.be.true;
    }));
    it("fetches a deal", () => __awaiter(void 0, void 0, void 0, function* () {
        // Arrange
        const marketFixture = yield (0, Market_fixture_1.programMarketFixture)(Market_fixture_1.globalMarketFixture);
        const marketName = "credix-marketplace";
        const marketAddress = yield src_1.Market.generatePDA(marketName, util_1.testProgramId);
        const getAccountInfoStub = sandbox.stub(util_1.testConnection, "getAccountInfo");
        getAccountInfoStub.withArgs(marketAddress[0]).returns(Promise.resolve(marketFixture));
        const market = yield util_1.testClient.fetchMarket(marketName);
        if (!market) {
            throw new Error();
        }
        const borrower = web3_js_1.Keypair.generate();
        const dealAddress = yield src_1.Deal.generatePDA(borrower.publicKey, 0, market);
        getAccountInfoStub
            .withArgs(dealAddress[0])
            .returns(Promise.resolve((0, Deal_fixture_1.programDealFixture)(Object.assign(Object.assign({}, Deal_fixture_1.dealFixture), { borrower: borrower.publicKey, bump: dealAddress[1] }))));
        // Act
        const deal = yield market.fetchDeal(borrower.publicKey, 0);
        // Assert
        (0, chai_1.expect)(deal === null || deal === void 0 ? void 0 : deal.address.equals(dealAddress[0])).to.be.true;
        (0, chai_1.expect)(deal === null || deal === void 0 ? void 0 : deal.borrower.equals(borrower.publicKey)).to.be.true;
        (0, chai_1.expect)(deal === null || deal === void 0 ? void 0 : deal.number).to.equal(0);
    }));
    it("fetches a credix pass", () => __awaiter(void 0, void 0, void 0, function* () {
        // Arrange
        const marketFixture = yield (0, Market_fixture_1.programMarketFixture)(Market_fixture_1.globalMarketFixture);
        const marketName = "credix-marketplace";
        const marketAddress = yield src_1.Market.generatePDA(marketName, util_1.testProgramId);
        const getAccountInfoStub = sandbox.stub(util_1.testConnection, "getAccountInfo");
        getAccountInfoStub.withArgs(marketAddress[0]).returns(Promise.resolve(marketFixture));
        const market = yield util_1.testClient.fetchMarket(marketName);
        if (!market) {
            throw new Error();
        }
        const borrower = web3_js_1.Keypair.generate();
        const credixPassAddress = yield src_1.CredixPass.generatePDA(borrower.publicKey, market);
        getAccountInfoStub
            .withArgs(credixPassAddress[0])
            .returns(Promise.resolve((0, CredixPass_fixture_1.programCredixPassFixture)(CredixPass_fixture_1.credixPassFixture)));
        // Act
        const credixPass = yield market.fetchCredixPass(borrower.publicKey);
        // Assert
        (0, chai_1.expect)(credixPass === null || credixPass === void 0 ? void 0 : credixPass.address.equals(credixPassAddress[0])).to.be.true;
    }));
    it("finds the liquidity pool token account", () => __awaiter(void 0, void 0, void 0, function* () {
        // Arrange
        const marketFixture = yield (0, Market_fixture_1.programMarketFixture)(Market_fixture_1.globalMarketFixture);
        const marketName = "credix-marketplace";
        const marketAddress = yield src_1.Market.generatePDA(marketName, util_1.testProgramId);
        const getAccountInfoStub = sandbox.stub(util_1.testConnection, "getAccountInfo");
        getAccountInfoStub.withArgs(marketAddress[0]).returns(Promise.resolve(marketFixture));
        const market = yield util_1.testClient.fetchMarket(marketName);
        if (!market) {
            throw new Error();
        }
        // Act
        const liquidityPoolTokenAccount = yield market.findLiquidityPoolTokenAccount();
        // Assert
        const signingAuthority = yield market.generateSigningAuthorityPDA();
        const expected = yield market.findBaseTokenAccount(signingAuthority[0]);
        (0, chai_1.expect)(liquidityPoolTokenAccount.equals(expected)).to.be.true;
    }));
    it("calculates the user stake in base", () => __awaiter(void 0, void 0, void 0, function* () {
        // Arrange
        const marketFixture = yield (0, Market_fixture_1.programMarketFixture)(Market_fixture_1.globalMarketFixture);
        const getAccountInfoStub = sandbox.stub(util_1.testConnection, "getAccountInfo");
        getAccountInfoStub.returns(Promise.resolve(marketFixture));
        const marketName = "credix-marketplace";
        const market = yield util_1.testClient.fetchMarket(marketName);
        if (!market) {
            throw new Error();
        }
        const liquidityPoolBaseTokenAccountPK = yield (market === null || market === void 0 ? void 0 : market.findLiquidityPoolTokenAccount());
        const getTokenAccountBalanceStub = sandbox.stub(util_1.testConnection, "getTokenAccountBalance");
        getTokenAccountBalanceStub
            .withArgs(liquidityPoolBaseTokenAccountPK)
            .returns(Promise.resolve((0, rpc_fixture_1.rpcResponseAndContextFixture)((0, Token_fixture_1.tokenAmountFixture)(10, 6))));
        const getTokenSupplyStub = sandbox.stub(util_1.testConnection, "getTokenSupply");
        getTokenSupplyStub.returns(Promise.resolve((0, rpc_fixture_1.rpcResponseAndContextFixture)((0, Token_fixture_1.tokenAmountFixture)(100, 6))));
        const user = web3_js_1.Keypair.generate();
        const userLPTokenAccount = yield market.findLPTokenAccount(user.publicKey);
        getTokenAccountBalanceStub
            .withArgs(userLPTokenAccount)
            .returns(Promise.resolve((0, rpc_fixture_1.rpcResponseAndContextFixture)((0, Token_fixture_1.tokenAmountFixture)(100, 6))));
        // Act
        const stake = yield market.getUserStake(user.publicKey);
        // Assert
        const price = yield market.getLPPrice();
        const expected = new big_js_1.default(100).mul(price);
        (0, chai_1.expect)(stake.eq(expected)).to.be.true;
    }));
}));
//# sourceMappingURL=Market.test.js.map