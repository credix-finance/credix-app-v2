import React, { FunctionComponent } from "react";
import { defineMessages, useIntl } from "react-intl";
import { Button } from "@components/Button";
import { Form, FormInstance } from "antd";
import { Icon, IconDimension, IconName } from "./Icon";
import { classNames, compactFormatter } from "@utils/format.utils";
import { TrancheOption } from "./TrancheOption";
import { SelectorCard } from "./SelectorCard";
import { TrancheStructure } from "@consts";
import { AmortizationRepaymentSchedule } from "./AmortizationRepaymentSchedule";
import { BulletLoanRepaymentSchedule } from "./BulletLoanRepaymentSchedule";
import { DealAdvancedSettings } from "./DealAdvancedSettings";
import { TrancheAdvancedSettings } from "./TrancheAdvancedSettings";
import { RepaymentScheduleType } from "@credix_types/repaymentschedule.types";
import { TrancheFormValue, TrancheTitle } from "@credix_types/tranche.types";

interface ReviewDealStepProps {
	form: FormInstance;
	className?: string;
	onBack: () => void;
}

enum ValueSize {
	LARGE,
	SMALL,
}

interface DealDetailProps {
	icon?: IconName;
	title: string;
	value: string;
	className?: string;
	valueSize?: ValueSize;
}
const DealDetail: FunctionComponent<DealDetailProps> = ({
	icon,
	title,
	value,
	className,
	valueSize = ValueSize.LARGE,
}) => {
	className = classNames([className, "p-6 border border-neutral-40 h-30 space-y-2"]);
	const valueClassName = classNames([valueSize === ValueSize.LARGE && "font-bold text-2xl"]);

	return (
		<div className={className}>
			<div className="flex items-center space-x-2 font-medium text-base">
				{icon && <Icon name={icon} size={IconDimension.MIDDLE} />}
				<span>{title}</span>
			</div>
			<div className={valueClassName}>{value}</div>
		</div>
	);
};

export const ReviewDealStep: FunctionComponent<ReviewDealStepProps> = ({
	form,
	className,
	onBack,
}) => {
	const principal = Form.useWatch("principal", form);
	const financingFee = Form.useWatch("financingFee", form);
	const timeToMaturity = Form.useWatch("timeToMaturity", form);
	const trueWaterfall = Form.useWatch("trueWaterfall", form);
	const slashInterestToPrincipal = Form.useWatch("slashInterestToPrincipal", form);
	const slashPrincipalToInterest = Form.useWatch("slashPrincipalToInterest", form);
	const intl = useIntl();
	const trancheStructure = Form.useWatch("trancheStructure", form) || TrancheFormValue.threeTranche;
	const formTranche: TrancheStructure = form.getFieldValue(trancheStructure);
	const trancheTitlesMap = Object.entries(TrancheTitle).reduce((acc, [key, value]) => {
		acc = {
			...acc,
			[key]: value,
		};
		return acc;
	}, {});

	if (!formTranche) {
		return null;
	}

	const formTranchesWithAdvancedSettings = Object.entries(formTranche).filter(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		([_, settings]) => !!settings.earlyWithdrawalInterest || !!settings.earlyWithdrawalPrincipal
	);

	className = classNames([className, "space-y-8"]);

	return (
		<div className={className}>
			<div className="uppercase text-2xl font-bold">
				{intl.formatMessage(MESSAGES.reviewDealTitle)}
			</div>
			<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
				<DealDetail
					icon="key"
					title={intl.formatMessage(MESSAGES.borrower)}
					value={form.getFieldValue("borrower")}
					className="col-span-2"
					valueSize={ValueSize.SMALL}
				/>
				<div className="col-span-2"></div>
				<DealDetail
					title={intl.formatMessage(MESSAGES.dealName)}
					value={form.getFieldValue("dealName")}
					className="col-span-1"
				/>
				<DealDetail
					title={intl.formatMessage(MESSAGES.principal)}
					value={`${compactFormatter.format(Number(form.getFieldValue("principal")))} USDC`}
					className="col-span-1"
				/>
				<DealDetail
					title={intl.formatMessage(MESSAGES.financingFee)}
					value={`${form.getFieldValue("financingFee")}%`}
					className="col-span-1"
				/>
				<DealDetail
					title={intl.formatMessage(MESSAGES.timeToMaturity)}
					value={`${form.getFieldValue("timeToMaturity")} DAYS`}
					className="col-span-1"
				/>
				<div className="uppercase text-2xl font-bold col-span-4">
					{intl.formatMessage(MESSAGES.advancedDealSettings)}
				</div>
			</div>
			<div className="flex gap-x-8 gap-y-4 flex-wrap">
				{!trueWaterfall && !slashInterestToPrincipal && !slashPrincipalToInterest && (
					<span>{intl.formatMessage(MESSAGES.noAdvancedSettings)}</span>
				)}
				<DealAdvancedSettings
					slashInterestToPrincipal={slashInterestToPrincipal}
					slashPrincipalToInterest={slashPrincipalToInterest}
					trueWaterfall={trueWaterfall}
				/>
			</div>
			<div className="uppercase text-2xl font-bold">{intl.formatMessage(MESSAGES.typeOfLoan)}</div>
			{form.getFieldValue("repaymentType") === RepaymentScheduleType.AMORTIZATION && (
				<SelectorCard
					content={
						<AmortizationRepaymentSchedule
							principal={Number(principal)}
							financingFee={Number(financingFee)}
							timeToMaturity={Number(timeToMaturity)}
						/>
					}
					value={RepaymentScheduleType.AMORTIZATION}
					title={intl.formatMessage(MESSAGES.amortizationLoan)}
					subtitle={intl.formatMessage(MESSAGES.amortizationLoanSubtitle)}
					checked={false}
					isInteractive={false}
					showContent={true}
					className="col-span-4"
				/>
			)}
			{form.getFieldValue("repaymentType") === RepaymentScheduleType.BULLET && (
				<SelectorCard
					content={
						<BulletLoanRepaymentSchedule
							principal={Number(principal)}
							financingFee={Number(financingFee)}
							timeToMaturity={Number(timeToMaturity)}
						/>
					}
					value={RepaymentScheduleType.BULLET}
					title={intl.formatMessage(MESSAGES.bulletLoan)}
					subtitle={intl.formatMessage(MESSAGES.bulletLoanSubtitle)}
					checked={false}
					isInteractive={false}
					showContent={true}
					className="col-span-4"
				/>
			)}
			<div className="uppercase text-2xl font-bold">
				{intl.formatMessage(MESSAGES.trancheStructure)}
			</div>
			{formTranche && (
				<SelectorCard
					content={<TrancheOption trancheStructure={formTranche} />}
					value={trancheStructure}
					title={trancheTitlesMap[trancheStructure]}
					checked={false}
					isInteractive={false}
					showContent={true}
					className="col-span-4"
				/>
			)}
			{formTranchesWithAdvancedSettings.length > 0 && (
				<div className="uppercase text-2xl font-bold">
					{intl.formatMessage(MESSAGES.advancedTrancheSettings)}
				</div>
			)}
			{formTranchesWithAdvancedSettings.map(([trancheName, settings]) => {
				return (
					<TrancheAdvancedSettings
						key={trancheName}
						trancheName={trancheName}
						earlyWithdrawalInterest={settings.earlyWithdrawalInterest}
						earlyWithdrawalPrincipal={settings.earlyWithdrawalPrincipal}
					/>
				);
			})}
			<div className="w-full h-[1px] mt-10  bg-neutral-105"></div>
			<div className="flex space-x-6">
				<Button type="default" onClick={onBack}>
					{intl.formatMessage(MESSAGES.back)}
				</Button>
				<Form.Item className="mb-0">
					<Button htmlType="submit" className="w-full md:w-max capitalize">
						{intl.formatMessage(MESSAGES.submit)}
					</Button>
				</Form.Item>
			</div>
		</div>
	);
};

const MESSAGES = defineMessages({
	submit: {
		defaultMessage: "Create Deal",
		description: "Review deal: submit button",
	},
	back: {
		defaultMessage: "Back",
		description: "Review deal: back button",
	},
	advancedTrancheSettings: {
		defaultMessage: "Advanced tranche settings",
		description: "Review deal: review advanced tranche settings",
	},
	trancheStructure: {
		defaultMessage: "tranche structure",
		description: "Review deal: review tranche structure",
	},
	bulletLoanSubtitle: {
		defaultMessage:
			"The Principal that is borrowed is paid back in full at the end of the loan term",
		description: "Reivew deal: repayment type selector bullet subtitle",
	},
	bulletLoan: {
		defaultMessage: "Bullet loan",
		description: "Review deal: repayment type selector bullet title",
	},
	amortizationLoanSubtitle: {
		defaultMessage: "Pay off a debt over time in equal installments",
		description: "Review deal: repayment type selector amortization subtitle",
	},
	amortizationLoan: {
		defaultMessage: "Amortization loan",
		description: "Review deal: repayment type selector amortization title",
	},
	typeOfLoan: {
		defaultMessage: "type of loan",
		description: "Review deal: review type of loan",
	},
	noAdvancedSettings: {
		defaultMessage: "No advanced settings",
		description: "Review deal: no advanced settings",
	},
	advancedDealSettings: {
		defaultMessage: "advanced deal settings",
		description: "Review deal: review advanced deal settings",
	},
	timeToMaturity: {
		defaultMessage: "Time to maturity",
		description: "Review deal: review deal time to maturity",
	},
	financingFee: {
		defaultMessage: "Financing fee",
		description: "Review deal: review deal financing fee",
	},
	principal: {
		defaultMessage: "Principal",
		description: "Review deal: review deal principal",
	},
	borrower: {
		defaultMessage: "Public key",
		description: "Review deal: review public key",
	},
	dealName: {
		defaultMessage: "Deal name",
		description: "Review deal: review deal name",
	},
	reviewDealTitle: {
		defaultMessage: "deal details",
		description: "Review deal: review step title",
	},
});
