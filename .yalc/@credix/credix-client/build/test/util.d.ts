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
        name: string;
        bump: number;
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
        lpTokenMint: PublicKey;
        baseTokenMint: PublicKey;
        interestFee: {
            numerator: number;
            denominator: number;
        };
        withdrawalFee: {
            numerator: number;
            denominator: number;
        };
        bump: number;
        totalOutstandingCredit: import("bn.js");
        signingAuthorityBump: number;
        frozen: boolean;
        seed: string;
    };
    borrowerInfo: {
        numOfDeals: number;
        bump: number;
    };
    credixPass: {
        isUnderwriter: boolean;
        isBorrower: boolean;
        releaseTimestamp: import("bn.js");
        bump: number;
        active: boolean;
        user: PublicKey;
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
            pda: {
                seeds: [{
                    kind: "arg";
                    type: "string";
                    path: "global_market_seed";
                }];
            };
        }, {
            name: "signingAuthority";
            isMut: false;
            isSigner: false;
            pda: {
                seeds: [{
                    kind: "account";
                    type: "publicKey";
                    account: "GlobalMarketState";
                    path: "global_market_state";
                }];
            };
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
            name: "lpTokenMint";
            isMut: true;
            isSigner: true;
        }, {
            name: "baseTokenMint";
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
        args: [string, {
            numerator: number;
            denominator: number;
        }, {
            numerator: number;
            denominator: number;
        }] & unknown[];
        namedArgs: {
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
            pda: {
                seeds: [{
                    kind: "account";
                    type: "publicKey";
                    account: "GlobalMarketState";
                    path: "global_market_state";
                }];
            };
        }, {
            name: "investorTokenAccount";
            isMut: true;
            isSigner: false;
        }, {
            name: "liquidityPoolTokenAccount";
            isMut: true;
            isSigner: false;
        }, {
            name: "lpTokenMint";
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
            pda: {
                seeds: [{
                    kind: "account";
                    type: "publicKey";
                    account: "GlobalMarketState";
                    path: "global_market_state";
                }, {
                    kind: "account";
                    type: "publicKey";
                    path: "investor";
                }, {
                    kind: "const";
                    type: "string";
                    value: "credix-pass";
                }];
            };
        }, {
            name: "baseTokenMint";
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
            pda: {
                seeds: [{
                    kind: "account";
                    type: "publicKey";
                    account: "GlobalMarketState";
                    path: "global_market_state";
                }, {
                    kind: "account";
                    type: "publicKey";
                    path: "borrower";
                }, {
                    kind: "const";
                    type: "string";
                    value: "borrower-info";
                }];
            };
        }, {
            name: "globalMarketState";
            isMut: false;
            isSigner: false;
        }, {
            name: "deal";
            isMut: true;
            isSigner: false;
            pda: {
                seeds: [{
                    kind: "account";
                    type: "publicKey";
                    account: "GlobalMarketState";
                    path: "global_market_state";
                }, {
                    kind: "account";
                    type: "publicKey";
                    path: "borrower";
                }, {
                    kind: "account";
                    type: "u16";
                    account: "BorrowerInfo";
                    path: "borrower_info.num_of_deals";
                }, {
                    kind: "const";
                    type: "string";
                    value: "deal-info";
                }];
            };
        }, {
            name: "credixPass";
            isMut: false;
            isSigner: false;
            pda: {
                seeds: [{
                    kind: "account";
                    type: "publicKey";
                    account: "GlobalMarketState";
                    path: "global_market_state";
                }, {
                    kind: "account";
                    type: "publicKey";
                    path: "borrower";
                }, {
                    kind: "const";
                    type: "string";
                    value: "credix-pass";
                }];
            };
        }, {
            name: "systemProgram";
            isMut: false;
            isSigner: false;
        }];
        args: [import("bn.js"), {
            numerator: number;
            denominator: number;
        }, number, {
            numerator: number;
            denominator: number;
        }, number, string] & unknown[];
        namedArgs: {
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
            pda: {
                seeds: [{
                    kind: "account";
                    type: "publicKey";
                    account: "GlobalMarketState";
                    path: "global_market_state";
                }];
            };
        }, {
            name: "deal";
            isMut: true;
            isSigner: false;
            pda: {
                seeds: [{
                    kind: "account";
                    type: "publicKey";
                    account: "GlobalMarketState";
                    path: "global_market_state";
                }, {
                    kind: "account";
                    type: "publicKey";
                    path: "borrower";
                }, {
                    kind: "account";
                    type: "u16";
                    account: "Deal";
                    path: "deal.deal_number";
                }, {
                    kind: "const";
                    type: "string";
                    value: "deal-info";
                }];
            };
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
            pda: {
                seeds: [{
                    kind: "account";
                    type: "publicKey";
                    account: "GlobalMarketState";
                    path: "global_market_state";
                }, {
                    kind: "account";
                    type: "publicKey";
                    path: "borrower";
                }, {
                    kind: "const";
                    type: "string";
                    value: "credix-pass";
                }];
            };
        }, {
            name: "baseTokenMint";
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
            pda: {
                seeds: [{
                    kind: "account";
                    type: "publicKey";
                    account: "GlobalMarketState";
                    path: "global_market_state";
                }, {
                    kind: "account";
                    type: "publicKey";
                    path: "borrower";
                }, {
                    kind: "account";
                    type: "u16";
                    account: "Deal";
                    path: "deal.deal_number";
                }, {
                    kind: "const";
                    type: "string";
                    value: "deal-info";
                }];
            };
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
            pda: {
                seeds: [{
                    kind: "account";
                    type: "publicKey";
                    account: "GlobalMarketState";
                    path: "global_market_state";
                }];
            };
        }, {
            name: "credixPass";
            isMut: false;
            isSigner: false;
            pda: {
                seeds: [{
                    kind: "account";
                    type: "publicKey";
                    account: "GlobalMarketState";
                    path: "global_market_state";
                }, {
                    kind: "account";
                    type: "publicKey";
                    path: "borrower";
                }, {
                    kind: "const";
                    type: "string";
                    value: "credix-pass";
                }];
            };
        }, {
            name: "baseTokenMint";
            isMut: false;
            isSigner: false;
        }, {
            name: "lpTokenMint";
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
            pda: {
                seeds: [{
                    kind: "account";
                    type: "publicKey";
                    account: "GlobalMarketState";
                    path: "global_market_state";
                }];
            };
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
            name: "lpTokenMint";
            isMut: true;
            isSigner: false;
        }, {
            name: "credixPass";
            isMut: false;
            isSigner: false;
            pda: {
                seeds: [{
                    kind: "account";
                    type: "publicKey";
                    account: "GlobalMarketState";
                    path: "global_market_state";
                }, {
                    kind: "account";
                    type: "publicKey";
                    path: "investor";
                }, {
                    kind: "const";
                    type: "string";
                    value: "credix-pass";
                }];
            };
        }, {
            name: "baseTokenMint";
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
            pda: {
                seeds: [{
                    kind: "account";
                    type: "publicKey";
                    account: "GlobalMarketState";
                    path: "global_market_state";
                }, {
                    kind: "account";
                    type: "publicKey";
                    path: "pass_holder";
                }, {
                    kind: "const";
                    type: "string";
                    value: "credix-pass";
                }];
            };
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
        args: [boolean, boolean, import("bn.js")] & unknown[];
        namedArgs: {
            isUnderwriter: boolean;
            isBorrower: boolean;
            releaseTimestamp: import("bn.js");
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
            pda: {
                seeds: [{
                    kind: "account";
                    type: "publicKey";
                    account: "GlobalMarketState";
                    path: "global_market_state";
                }, {
                    kind: "account";
                    type: "publicKey";
                    path: "pass_holder";
                }, {
                    kind: "const";
                    type: "string";
                    value: "credix-pass";
                }];
            };
        }, {
            name: "globalMarketState";
            isMut: false;
            isSigner: false;
        }];
        args: [boolean, boolean, boolean, import("bn.js")] & unknown[];
        namedArgs: {
            isUnderwriter: boolean;
            isBorrower: boolean;
            releaseTimestamp: import("bn.js");
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
    updateLpTokenMetadata: {
        accounts: [{
            name: "owner";
            isMut: true;
            isSigner: true;
        }, {
            name: "globalMarketState";
            isMut: false;
            isSigner: false;
        }, {
            name: "metadataPda";
            isMut: true;
            isSigner: false;
        }, {
            name: "lpTokenMint";
            isMut: true;
            isSigner: false;
        }, {
            name: "signingAuthority";
            isMut: false;
            isSigner: false;
            pda: {
                seeds: [{
                    kind: "account";
                    type: "publicKey";
                    account: "GlobalMarketState";
                    path: "global_market_state";
                }];
            };
        }, {
            name: "tokenMetadataProgram";
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
        args: [string, string] & unknown[];
        namedArgs: {
            symbol: string;
            name: string;
        };
    };
}, {}>;
//# sourceMappingURL=util.d.ts.map