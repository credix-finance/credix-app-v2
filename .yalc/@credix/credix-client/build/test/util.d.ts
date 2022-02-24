/// <reference types="bn.js" />
import { Connection, PublicKey } from "@solana/web3.js";
import { CredixClient } from "../src";
export declare const testProgramId: PublicKey;
export declare const testConnection: Connection;
export declare const testClient: CredixClient;
export declare const testProgram: import("@saberhq/anchor-contrib").AnchorProgram<import("../src/idl/credix").Credix, {
    deal: {
        borrower: PublicKey;
        principal: import("bn.js");
        financingFeePercentage: {
            numerator: number;
            denominator: number;
        };
        leverageRatio: number;
        underwriterPerformanceFeePercentage: {
            numerator: number;
            denominator: number;
        };
        timeToMaturityDays: number;
        bump: number;
        name: string;
        principalAmountRepaid: import("bn.js");
        interestAmountRepaid: import("bn.js");
        goLiveAt: import("bn.js");
        createdAt: import("bn.js");
        dealNumber: number;
        lateFees: import("bn.js");
        lateFeesRepaid: import("bn.js");
        private: boolean;
        defaulted: boolean;
    };
    globalMarketState: {
        gatekeeperNetwork: PublicKey;
        treasuryPoolTokenAccount: PublicKey;
        lpTokenMintAccount: PublicKey;
        signingAuthorityBump: number;
        interestFee: {
            numerator: number;
            denominator: number;
        };
        withdrawalFee: {
            numerator: number;
            denominator: number;
        };
        bump: number;
        liquidityPoolTokenMintAccount: PublicKey;
        totalOutstandingCredit: import("bn.js");
        frozen: boolean;
    };
    borrowerInfo: {
        numOfDeals: number;
        bump: number;
    };
    credixPass: {
        isUnderwriter: boolean;
        isBorrower: boolean;
        bump: number;
        active: boolean;
    };
}, import("@saberhq/anchor-contrib").AnchorDefined<import("../src/idl/credix").Credix, {
    DealRepaymentType: import("../src/idl/idl.types").RepaymentType;
    Ratio: import("../src/idl/idl.types").Ratio;
}>, {
    initializeMarket: {
        accounts: [{
            name: "owner";
            isMut: true;
            isSigner: true;
        }, {
            name: "gatekeeperNetwork";
            isMut: false;
            isSigner: false;
        }, {
            name: "globalMarketState";
            isMut: true;
            isSigner: false;
        }, {
            name: "signingAuthority";
            isMut: false;
            isSigner: false;
        }, {
            name: "liquidityPoolTokenAccount";
            isMut: true;
            isSigner: false;
        }, {
            name: "treasury";
            isMut: false;
            isSigner: false;
        }, {
            name: "treasuryPoolTokenAccount";
            isMut: true;
            isSigner: false;
        }, {
            name: "lpTokenMintAccount";
            isMut: true;
            isSigner: true;
        }, {
            name: "baseMintAccount";
            isMut: false;
            isSigner: false;
        }, {
            name: "associatedTokenProgram";
            isMut: false;
            isSigner: false;
        }, {
            name: "rent";
            isMut: false;
            isSigner: false;
        }, {
            name: "tokenProgram";
            isMut: false;
            isSigner: false;
        }, {
            name: "systemProgram";
            isMut: false;
            isSigner: false;
        }];
        args: [number, number, string, {
            numerator: number;
            denominator: number;
        }, {
            numerator: number;
            denominator: number;
        }] & unknown[];
        namedArgs: {
            signingAuthorityBump: number;
            globalMarketStateBump: number;
            globalMarketSeed: string;
            interestFee: {
                numerator: number;
                denominator: number;
            };
            withdrawalFee: {
                numerator: number;
                denominator: number;
            };
        };
    };
    depositFunds: {
        accounts: [{
            name: "investor";
            isMut: true;
            isSigner: true;
        }, {
            name: "gatewayToken";
            isMut: false;
            isSigner: false;
        }, {
            name: "globalMarketState";
            isMut: true;
            isSigner: false;
        }, {
            name: "signingAuthority";
            isMut: false;
            isSigner: false;
        }, {
            name: "investorTokenAccount";
            isMut: true;
            isSigner: false;
        }, {
            name: "liquidityPoolTokenAccount";
            isMut: true;
            isSigner: false;
        }, {
            name: "lpTokenMintAccount";
            isMut: true;
            isSigner: false;
        }, {
            name: "investorLpTokenAccount";
            isMut: true;
            isSigner: false;
        }, {
            name: "credixPass";
            isMut: false;
            isSigner: false;
        }, {
            name: "baseMintAccount";
            isMut: false;
            isSigner: false;
        }, {
            name: "associatedTokenProgram";
            isMut: false;
            isSigner: false;
        }, {
            name: "rent";
            isMut: false;
            isSigner: false;
        }, {
            name: "tokenProgram";
            isMut: false;
            isSigner: false;
        }, {
            name: "systemProgram";
            isMut: false;
            isSigner: false;
        }];
        args: [import("bn.js")] & unknown[];
        namedArgs: {
            amount: import("bn.js");
        };
    };
    createDeal: {
        accounts: [{
            name: "owner";
            isMut: true;
            isSigner: true;
        }, {
            name: "gatewayToken";
            isMut: false;
            isSigner: false;
        }, {
            name: "borrower";
            isMut: false;
            isSigner: false;
        }, {
            name: "borrowerInfo";
            isMut: true;
            isSigner: false;
        }, {
            name: "globalMarketState";
            isMut: false;
            isSigner: false;
        }, {
            name: "deal";
            isMut: true;
            isSigner: false;
        }, {
            name: "credixPass";
            isMut: false;
            isSigner: false;
        }, {
            name: "systemProgram";
            isMut: false;
            isSigner: false;
        }];
        args: [number, number, import("bn.js"), {
            numerator: number;
            denominator: number;
        }, number, {
            numerator: number;
            denominator: number;
        }, number, string] & unknown[];
        namedArgs: {
            dealBump: number;
            borrowerInfoBump: number;
            principal: import("bn.js");
            financingFeePercentage: {
                numerator: number;
                denominator: number;
            };
            leverageRatio: number;
            underwriterPerformanceFeePercentage: {
                numerator: number;
                denominator: number;
            };
            timeToMaturityDays: number;
            dealName: string;
        };
    };
    activateDeal: {
        accounts: [{
            name: "owner";
            isMut: true;
            isSigner: true;
        }, {
            name: "gatewayToken";
            isMut: false;
            isSigner: false;
        }, {
            name: "globalMarketState";
            isMut: true;
            isSigner: false;
        }, {
            name: "signingAuthority";
            isMut: false;
            isSigner: false;
        }, {
            name: "deal";
            isMut: true;
            isSigner: false;
        }, {
            name: "liquidityPoolTokenAccount";
            isMut: true;
            isSigner: false;
        }, {
            name: "borrower";
            isMut: false;
            isSigner: false;
        }, {
            name: "borrowerTokenAccount";
            isMut: true;
            isSigner: false;
        }, {
            name: "credixPass";
            isMut: false;
            isSigner: false;
        }, {
            name: "baseMintAccount";
            isMut: false;
            isSigner: false;
        }, {
            name: "associatedTokenProgram";
            isMut: false;
            isSigner: false;
        }, {
            name: "rent";
            isMut: false;
            isSigner: false;
        }, {
            name: "tokenProgram";
            isMut: false;
            isSigner: false;
        }, {
            name: "systemProgram";
            isMut: false;
            isSigner: false;
        }];
        args: [] & unknown[];
        namedArgs: {};
    };
    makeDealRepayment: {
        accounts: [{
            name: "borrower";
            isMut: false;
            isSigner: true;
        }, {
            name: "gatewayToken";
            isMut: false;
            isSigner: false;
        }, {
            name: "globalMarketState";
            isMut: true;
            isSigner: false;
        }, {
            name: "borrowerTokenAccount";
            isMut: true;
            isSigner: false;
        }, {
            name: "deal";
            isMut: true;
            isSigner: false;
        }, {
            name: "liquidityPoolTokenAccount";
            isMut: true;
            isSigner: false;
        }, {
            name: "treasuryPoolTokenAccount";
            isMut: true;
            isSigner: false;
        }, {
            name: "signingAuthority";
            isMut: false;
            isSigner: false;
        }, {
            name: "credixPass";
            isMut: false;
            isSigner: false;
        }, {
            name: "baseMintAccount";
            isMut: false;
            isSigner: false;
        }, {
            name: "lpTokenMintAccount";
            isMut: true;
            isSigner: false;
        }, {
            name: "associatedTokenProgram";
            isMut: false;
            isSigner: false;
        }, {
            name: "tokenProgram";
            isMut: false;
            isSigner: false;
        }];
        args: [import("bn.js"), {}] & unknown[];
        namedArgs: {
            amount: import("bn.js");
            repaymentType: {};
        };
    };
    withdrawFunds: {
        accounts: [{
            name: "investor";
            isMut: false;
            isSigner: true;
        }, {
            name: "gatewayToken";
            isMut: false;
            isSigner: false;
        }, {
            name: "globalMarketState";
            isMut: true;
            isSigner: false;
        }, {
            name: "signingAuthority";
            isMut: false;
            isSigner: false;
        }, {
            name: "investorLpTokenAccount";
            isMut: true;
            isSigner: false;
        }, {
            name: "investorTokenAccount";
            isMut: true;
            isSigner: false;
        }, {
            name: "liquidityPoolTokenAccount";
            isMut: true;
            isSigner: false;
        }, {
            name: "treasuryPoolTokenAccount";
            isMut: true;
            isSigner: false;
        }, {
            name: "lpTokenMintAccount";
            isMut: true;
            isSigner: false;
        }, {
            name: "credixPass";
            isMut: false;
            isSigner: false;
        }, {
            name: "baseMintAccount";
            isMut: false;
            isSigner: false;
        }, {
            name: "associatedTokenProgram";
            isMut: false;
            isSigner: false;
        }, {
            name: "tokenProgram";
            isMut: false;
            isSigner: false;
        }];
        args: [import("bn.js")] & unknown[];
        namedArgs: {
            baseWithdrawalAmount: import("bn.js");
        };
    };
    createCredixPass: {
        accounts: [{
            name: "owner";
            isMut: true;
            isSigner: true;
        }, {
            name: "passHolder";
            isMut: false;
            isSigner: false;
        }, {
            name: "credixPass";
            isMut: true;
            isSigner: false;
        }, {
            name: "globalMarketState";
            isMut: false;
            isSigner: false;
        }, {
            name: "rent";
            isMut: false;
            isSigner: false;
        }, {
            name: "systemProgram";
            isMut: false;
            isSigner: false;
        }];
        args: [number, boolean, boolean] & unknown[];
        namedArgs: {
            passBump: number;
            isUnderwriter: boolean;
            isBorrower: boolean;
        };
    };
    updateCredixPass: {
        accounts: [{
            name: "owner";
            isMut: false;
            isSigner: true;
        }, {
            name: "passHolder";
            isMut: false;
            isSigner: false;
        }, {
            name: "credixPass";
            isMut: true;
            isSigner: false;
        }, {
            name: "globalMarketState";
            isMut: false;
            isSigner: false;
        }];
        args: [boolean, boolean, boolean] & unknown[];
        namedArgs: {
            isUnderwriter: boolean;
            isBorrower: boolean;
            isActive: boolean;
        };
    };
    freezeGlobalMarketState: {
        accounts: [{
            name: "owner";
            isMut: false;
            isSigner: true;
        }, {
            name: "globalMarketState";
            isMut: true;
            isSigner: false;
        }];
        args: [] & unknown[];
        namedArgs: {};
    };
    thawGlobalMarketState: {
        accounts: [{
            name: "owner";
            isMut: false;
            isSigner: true;
        }, {
            name: "globalMarketState";
            isMut: true;
            isSigner: false;
        }];
        args: [] & unknown[];
        namedArgs: {};
    };
}, {}>;
//# sourceMappingURL=util.d.ts.map