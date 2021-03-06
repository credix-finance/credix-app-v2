import { FunctionComponent } from "react";
import { defineMessages, useIntl } from "react-intl";
import { validateMinValue, validatePublicKey } from "@utils/validation.utils";
import { classNames } from "@utils/format.utils";
import { Input } from "@components/Input";
import { TextArea } from "@components/TextArea";
import { Form, FormInstance, Radio } from "antd";
import { FormItem } from "./FormItem";
import { SelectorCard } from "./SelectorCard";
import { AmortizationRepaymentSchedule } from "./AmortizationRepaymentSchedule";
import { BulletLoanRepaymentSchedule } from "./BulletLoanRepaymentSchedule";
import { Button } from "./Button";
import { Icon, IconDimension } from "./Icon";
import { RepaymentScheduleType } from "@credix_types/repaymentschedule.types";
import { DealFormValidationField } from "./DealForm";
import { AdvancedSettingsDrawer } from "./AdvancedSettingsDrawer";

interface DealDetailsStepProps {
	className?: string;
	form: FormInstance;
	onNextStep: (shouldValidateFields: boolean, nextStep: number) => void;
}

export const DealDetailsStep: FunctionComponent<DealDetailsStepProps> = ({
	className,
	form,
	onNextStep,
}) => {
	const shouldValidateFields = true;
	const nextStepNumber = 1;
	const selectedRepaymentType = Form.useWatch("repaymentType", form);
	const principal = Form.useWatch("principal", form);
	const financingFee = Form.useWatch("financingFee", form);
	const timeToMaturity = Form.useWatch("timeToMaturity", form);
	const intl = useIntl();

	className = classNames([className, "space-y-8"]);

	const validateBorrowerKey = (value): Promise<void> => {
		const validationMessage = intl.formatMessage(MESSAGES.borrowerKeyValidation);
		return validatePublicKey(value, validationMessage);
	};

	const validateMinPrincipal = (value): Promise<void> => {
		const minAmount = 0;
		const validationMessage = intl.formatMessage(MESSAGES.principalValidation, {
			amount: minAmount,
		});
		return validateMinValue(value, minAmount, validationMessage);
	};

	const validateMinTimeToMaturity = (value): Promise<void> => {
		const minAmount = 0;
		const validationMessage = intl.formatMessage(MESSAGES.timeToMaturityValidation, {
			amount: minAmount,
		});
		return validateMinValue(value, minAmount, validationMessage);
	};

	return (
		<div className={className}>
			<div>{intl.formatMessage(MESSAGES.dealFormTitle)}</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-20">
				<div>
					<Input
						className="bg-credix-primary"
						name={DealFormValidationField.DealName}
						label={intl.formatMessage(MESSAGES.nameInputLabel)}
						placeholder={intl.formatMessage(MESSAGES.nameInputPlaceholder)}
						type="text"
						required={true}
						rules={[
							{
								required: true,
								message: intl.formatMessage(MESSAGES.nameRequiredValidation),
							},
						]}
					/>
					<Input
						name={DealFormValidationField.Borrower}
						className="bg-credix-primary"
						label={intl.formatMessage(MESSAGES.borrowerKeyInputLabel)}
						placeholder={intl.formatMessage(MESSAGES.borrowerKeyInputPlaceholder)}
						type="text"
						required={true}
						rules={[
							{
								required: true,
								message: intl.formatMessage(MESSAGES.borrowerKeyRequiredValidation),
							},
							{
								validator(_, value) {
									return validateBorrowerKey(value);
								},
							},
						]}
					/>
					<TextArea
						rows={6}
						name="details"
						className="bg-credix-primary"
						label={intl.formatMessage(MESSAGES.detailsInputLabel)}
						placeholder={intl.formatMessage(MESSAGES.detailsInputPlaceholder)}
						required={true}
					/>
				</div>
				<div>
					<Input
						name={DealFormValidationField.Principal}
						className="bg-credix-primary"
						label={intl.formatMessage(MESSAGES.principalInputLabel)}
						placeholder={intl.formatMessage(MESSAGES.principalInputPlaceholder)}
						type="number"
						lang="en"
						step="1"
						required={true}
						rules={[
							{ required: true },
							{
								validator(_, value) {
									return validateMinPrincipal(value);
								},
							},
						]}
					/>
					<Input
						name={DealFormValidationField.FinancingFee}
						className="bg-credix-primary"
						label={intl.formatMessage(MESSAGES.financingFeeInputLabel)}
						placeholder={intl.formatMessage(MESSAGES.financingFeeInputPlaceholder)}
						type="number"
						lang="en"
						step="0.1"
						required={true}
						rules={[
							{
								required: true,
								message: intl.formatMessage(MESSAGES.financingFeeRequiredValidation),
							},
						]}
					/>
					<Input
						name={DealFormValidationField.TimeToMaturity}
						className="bg-credix-primary"
						label={intl.formatMessage(MESSAGES.timeToMaturityInputLabel)}
						placeholder={intl.formatMessage(MESSAGES.timeToMaturityInputPlaceholder)}
						type="number"
						required={true}
						step="1"
						lang="en"
						rules={[
							{
								required: true,
								message: intl.formatMessage(MESSAGES.timeToMaturityRequiredValidation),
							},
							{
								validator(_, value) {
									return validateMinTimeToMaturity(value);
								},
							},
						]}
					/>
					<Input
						name="repaymentPeriod"
						className="bg-credix-primary"
						disabled={true}
						label={intl.formatMessage(MESSAGES.repaymentPeriodInputLabel)}
						placeholder={intl.formatMessage(MESSAGES.repaymentPeriodInputPlaceholder)}
						type="number"
						step="1"
						lang="en"
					/>
				</div>
			</div>
			<FormItem
				name={DealFormValidationField.RepaymentType}
				rules={[
					{
						required: true,
						message: intl.formatMessage(MESSAGES.repaymentPeriodRequiredValidation),
					},
				]}
			>
				<Radio.Group>
					<div className="space-y-4">
						<SelectorCard
							isInteractive={true}
							content={
								<AmortizationRepaymentSchedule
									principal={Number(principal)}
									financingFee={Number(financingFee)}
									timeToMaturity={Number(timeToMaturity)}
								/>
							}
							value={RepaymentScheduleType.AMORTIZATION}
							title={intl.formatMessage(MESSAGES.amortizationLoanTitle)}
							subtitle={intl.formatMessage(MESSAGES.amortizationLoanSubtitle)}
							checked={selectedRepaymentType === RepaymentScheduleType.AMORTIZATION}
						/>
						<SelectorCard
							isInteractive={true}
							content={
								<BulletLoanRepaymentSchedule
									principal={Number(principal)}
									financingFee={Number(financingFee)}
									timeToMaturity={Number(timeToMaturity)}
								/>
							}
							value={RepaymentScheduleType.BULLET}
							title={intl.formatMessage(MESSAGES.bulletLoanTitle)}
							subtitle={intl.formatMessage(MESSAGES.bulletLoanSubtitle)}
							checked={selectedRepaymentType === RepaymentScheduleType.BULLET}
						/>
					</div>
				</Radio.Group>
			</FormItem>
			<div className="w-full h-[1px] mt-10  bg-neutral-105"></div>
			<AdvancedSettingsDrawer className="mt-8" />
			<Button
				className="mt-8"
				icon={<Icon name="plus-square" size={IconDimension.MIDDLE} />}
				onClick={() => onNextStep(shouldValidateFields, nextStepNumber)}
			>
				{intl.formatMessage(MESSAGES.nextStepButton)}
			</Button>
		</div>
	);
};

const MESSAGES = defineMessages({
	borrowerKeyValidation: {
		defaultMessage: "'borrower key' isn't valid",
		description: "Deal form: borrower key validation message",
	},
	principalValidation: {
		defaultMessage: "'principal' needs to be greater than {amount}",
		description: "Deal form: min principal validation message",
	},
	timeToMaturityValidation: {
		defaultMessage: "'time to maturity' needs to be greater than {amount}",
		description: "Deal form: min time to maturity validation message",
	},
	dealFormTitle: {
		defaultMessage: "Please fill in all information needed to submit a new deal.",
		description: "New deal: details form title",
	},
	nameInputLabel: {
		defaultMessage: "Deal Name",
		description: "Deal form: deal name input label",
	},
	nameInputPlaceholder: {
		defaultMessage: "Name",
		description: "Deal form: deal name input placeholder",
	},
	nameRequiredValidation: {
		defaultMessage: "'deal name' is required",
		description: "Deal form: deal name required validation message",
	},
	borrowerKeyInputLabel: {
		defaultMessage: "Borrower Key",
		description: "Deal form: borrower key input label",
	},
	borrowerKeyInputPlaceholder: {
		defaultMessage: "Public key",
		description: "Deal form: borrower key input placeholder",
	},
	borrowerKeyRequiredValidation: {
		defaultMessage: "'borrower key' is required",
		description: "Deal form: borrower key required validation message",
	},
	detailsInputLabel: {
		defaultMessage: "More details",
		description: "Deal form: more details textarea label",
	},
	detailsInputPlaceholder: {
		defaultMessage: "Type more information",
		description: "Deal form: more details textarea placeholder",
	},
	principalInputLabel: {
		defaultMessage: "Principal",
		description: "Deal form: principal input label",
	},
	principalInputPlaceholder: {
		defaultMessage: "USDC amount",
		description: "Deal form: principal input placeholder",
	},
	financingFeeInputLabel: {
		defaultMessage: "Financing Fee",
		description: "Deal form: financing fee input label",
	},
	financingFeeInputPlaceholder: {
		defaultMessage: "%",
		description: "Deal form: financing fee input placeholder",
	},
	financingFeeRequiredValidation: {
		defaultMessage: "'financing fee' is required",
		description: "Deal form: financing fee required validation message",
	},
	timeToMaturityInputLabel: {
		defaultMessage: "Time To Maturity",
		description: "Deal form: time to maturity input label",
	},
	timeToMaturityInputPlaceholder: {
		defaultMessage: "Number of days",
		description: "Deal form: time to maturity input placeholder",
	},
	timeToMaturityRequiredValidation: {
		defaultMessage: "'time to maturity' is required",
		description: "Deal form: time to maturity required validation message",
	},
	repaymentPeriodInputLabel: {
		defaultMessage: "Repayment period",
		description: "Deal form: repayment period input label",
	},
	repaymentPeriodInputPlaceholder: {
		defaultMessage: "30 days",
		description: "Deal form: repayment period input placeholder",
	},
	repaymentPeriodRequiredValidation: {
		defaultMessage: "'Repayment schedule' is required",
		description: "Deal form: repayment schedule required validation message",
	},
	amortizationLoanTitle: {
		defaultMessage: "Amortization loan",
		description: "Deal form: repayment type selector amortization title",
	},
	amortizationLoanSubtitle: {
		defaultMessage: "Pay off a debt over time in equal installments",
		description: "Deal form: repayment type selector amortization subtitle",
	},
	bulletLoanTitle: {
		defaultMessage: "Bullet loan",
		description: "Deal form: repayment type selector bullet title",
	},
	bulletLoanSubtitle: {
		defaultMessage:
			"The Principal that is borrowed is paid back in full at the end of the loan term",
		description: "Deal form: repayment type selector bullet subtitle",
	},
	nextStepButton: {
		defaultMessage: "Add tranche structure",
		description: "Deal form: go to tranche step button",
	},
});
