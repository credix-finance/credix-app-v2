import { FunctionComponent } from "react";
import { useIntl } from "react-intl";
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

interface DealDetailsStepProps {
	className?: string;
	form: FormInstance;
	onNextStep: (fieldsToValidate: string[], nextStep: number) => void;
}

export const DealDetailsStep: FunctionComponent<DealDetailsStepProps> = ({
	className,
	form,
	onNextStep,
}) => {
	const selectedRepaymentType = Form.useWatch("repaymentType", form);
	const principal = Form.useWatch("principal", form);
	const financingFee = Form.useWatch("financingFee", form);
	const timeToMaturity = Form.useWatch("timeToMaturity", form);
	const intl = useIntl();

	className = classNames([className, "space-y-8"]);

	const validateBorrowerKey = (value): Promise<void> => {
		const validationMessage = intl.formatMessage({
			defaultMessage: "'borrower key' isn't valid",
			description: "Deal form: borrower key validation message",
		});
		return validatePublicKey(value, validationMessage);
	};

	const validateMinPrincipal = (value): Promise<void> => {
		const validationMessage = intl.formatMessage({
			defaultMessage: "'principal' needs to be greater than 0",
			description: "Deal form: min principal validation message",
		});
		return validateMinValue(value, 0, validationMessage);
	};

	const validateMinTimeToMaturity = (value): Promise<void> => {
		const validationMessage = intl.formatMessage({
			defaultMessage: "'time to maturity' needs to be greater than 0",
			description: "Deal form: min time to maturity validation message",
		});
		return validateMinValue(value, 0, validationMessage);
	};

	return (
		<div className={className}>
			<div>
				{intl.formatMessage({
					defaultMessage: "Please fill in all information needed to submit a new deal.",
					description: "New deal: details form title",
				})}
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-20">
				<div>
					<Input
						name="dealName"
						label={intl.formatMessage({
							defaultMessage: "Deal Name",
							description: "Deal form: deal name input label",
						})}
						placeholder={intl.formatMessage({
							defaultMessage: "Name",
							description: "Deal form: deal name input placeholder",
						})}
						type="text"
						required={true}
						rules={[
							{
								required: true,
								message: intl.formatMessage({
									defaultMessage: "'deal name' is required",
									description: "Deal form: deal name required validation message",
								}),
							},
						]}
					/>
					<Input
						name="borrower"
						label={intl.formatMessage({
							defaultMessage: "Borrower Key",
							description: "Deal form: borrower key input label",
						})}
						placeholder={intl.formatMessage({
							defaultMessage: "Public key",
							description: "Deal form: borrower key input placeholder",
						})}
						type="text"
						required={true}
						rules={[
							{
								required: true,
								message: intl.formatMessage({
									defaultMessage: "'borrower key' is required",
									description: "Deal form: borrower key required validation message",
								}),
							},
							{
								validator(_, value) {
									return validateBorrowerKey(value);
								},
							},
						]}
					/>
					<TextArea
						rows={5}
						name="details"
						label={intl.formatMessage({
							defaultMessage: "More details",
							description: "Deal form: more details textarea label",
						})}
						placeholder={intl.formatMessage({
							defaultMessage: "Type more information",
							description: "Deal form: more details textarea placeholder",
						})}
						required={true}
					/>
				</div>
				<div>
					<Input
						name="principal"
						label={intl.formatMessage({
							defaultMessage: "Principal",
							description: "Deal form: principal input label",
						})}
						placeholder={intl.formatMessage({
							defaultMessage: "USDC amount",
							description: "Deal form: principal input placeholder",
						})}
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
						name="financingFee"
						label={intl.formatMessage({
							defaultMessage: "Financing Fee",
							description: "Deal form: financing fee input label",
						})}
						placeholder={intl.formatMessage({
							defaultMessage: "%",
							description: "Deal form: financing fee input placeholder",
						})}
						type="number"
						lang="en"
						step="0.1"
						required={true}
						rules={[
							{
								required: true,
								message: intl.formatMessage({
									defaultMessage: "'financing fee' is required",
									description: "Deal form: financing fee required validation message",
								}),
							},
						]}
					/>
					<Input
						name="timeToMaturity"
						label={intl.formatMessage({
							defaultMessage: "Time To Maturity",
							description: "Deal form: time to maturity input label",
						})}
						placeholder={intl.formatMessage({
							defaultMessage: "Number of days",
							description: "Deal form: time to maturity input placeholder",
						})}
						type="number"
						required={true}
						step="1"
						lang="en"
						rules={[
							{
								required: true,
								message: intl.formatMessage({
									defaultMessage: "'time to maturity' is required",
									description: "Deal form: time to maturity required validation message",
								}),
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
						disabled={true}
						label={intl.formatMessage({
							defaultMessage: "Repayment period",
							description: "Deal form: repayment period input label",
						})}
						placeholder={intl.formatMessage({
							defaultMessage: "30 days",
							description: "Deal form: repayment period input placeholder",
						})}
						type="number"
						step="1"
						lang="en"
					/>
				</div>
			</div>
			<FormItem name="repaymentType">
				<Radio.Group>
					<div className="space-y-4">
						<SelectorCard
							content={
								<AmortizationRepaymentSchedule
									principal={Number(principal)}
									financingFee={Number(financingFee)}
									timeToMaturity={Number(timeToMaturity)}
								/>
							}
							value="amortization"
							title={intl.formatMessage({
								defaultMessage: "Amortization loan",
								description: "Deal form: repayment type selector amortization title",
							})}
							subtitle={intl.formatMessage({
								defaultMessage: "Pay off a debt over time in equal installments",
								description: "Deal form: repayment type selector amortization subtitle",
							})}
							checked={selectedRepaymentType === "amortization"}
							selectCard={() => {
								form.setFieldsValue({
									repaymentType: "amortization",
								});
							}}
						/>
						<SelectorCard
							content={
								<BulletLoanRepaymentSchedule
									principal={Number(principal)}
									financingFee={Number(financingFee)}
									timeToMaturity={Number(timeToMaturity)}
								/>
							}
							value="bullet"
							title={intl.formatMessage({
								defaultMessage: "Bullet loan",
								description: "Deal form: repayment type selector bullet title",
							})}
							subtitle={intl.formatMessage({
								defaultMessage:
									"The Principal that is borrowed is paid back in full at the end of the loan term",
								description: "Deal form: repayment type selector bullet subtitle",
							})}
							checked={selectedRepaymentType === "bullet"}
							selectCard={() => {
								form.setFieldsValue({
									repaymentType: "bullet",
								});
							}}
						/>
					</div>
				</Radio.Group>
			</FormItem>
			<div className="w-full h-[1px] mt-10  bg-neutral-105"></div>
			<Button
				className="mt-8"
				icon={<Icon name="plus-square" size={IconDimension.MIDDLE} />}
				onClick={() =>
					onNextStep(["dealName", "borrower", "principal", "financingFee", "timeToMaturity"], 1)
				}
			>
				{intl.formatMessage({
					defaultMessage: "Add tranche structure",
					description: "Deal form: go to tranche step button",
				})}
			</Button>
		</div>
	);
};
