import { AnchorTypes } from "@saberhq/anchor-contrib";
import { Credix } from "../idl/credix";
export declare type CredixTypes = AnchorTypes<Credix, {
    deal: Deal;
    globalMarketState: GlobalMarketState;
    borrowerInfo: BorrowerInfo;
    credixPass: CredixPass;
}, {
    DealRepaymentType: RepaymentType;
    Ratio: Ratio;
}>;
export declare type CredixProgram = CredixTypes["Program"];
export declare type CredixAccounts = CredixTypes["Accounts"];
export declare type Deal = CredixAccounts["deal"];
export declare type CredixPass = CredixAccounts["credixPass"];
export declare type GlobalMarketState = CredixAccounts["globalMarketState"];
export declare type BorrowerInfo = CredixAccounts["borrowerInfo"];
export declare type Ratio = {
    numerator: number;
    denominator: number;
};
export declare type PrincipalRepaymentType = {
    principal: Record<string, never>;
};
export declare type InterestRepaymentType = {
    interest: Record<string, never>;
};
export declare type RepaymentType = PrincipalRepaymentType | InterestRepaymentType;
//# sourceMappingURL=idl.types.d.ts.map