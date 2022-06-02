import React, { FunctionComponent } from "react";
import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { Form } from "antd";
import { validateMinValue, validatePublicKey } from "@utils/validation.utils";
import { useIntl } from "react-intl";

export interface DealFormInput {
	principal: number;
	financingFee: number;
	timeToMaturity: number;
	borrower: string;
	dealName: string;
}

interface DealFormProps {
	borrowLimit: string;
	onSubmit: ({
		principal,
		financingFee,
		timeToMaturity,
		borrower,
		dealName,
	}: DealFormInput) => void;
}

const DealForm: FunctionComponent<DealFormProps> = ({ onSubmit, borrowLimit }) => {
	const [form] = Form.useForm();
	const intl = useIntl();

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

	const validateBorrowerKey = (value): Promise<void> => {
		const validationMessage = intl.formatMessage({
			defaultMessage: "'borrower key' isn't valid",
			description: "Deal form: borrower key validation message",
		});
		return validatePublicKey(value, validationMessage);
	};

	return (
		<Form name="deal" form={form} onFinish={onSubmit} layout="vertical">
			<Input
				name="dealName"
				data-cy="deal-form-name-input"
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
				data-cy="deal-form-borrower-input"
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
			<Input
				name="principal"
				data-cy="deal-form-principal-input"
				label={intl.formatMessage({
					defaultMessage: "Principal",
					description: "Deal form: principal input label",
				})}
				placeholder={intl.formatMessage({
					defaultMessage: "USDC amount",
					description: "Deal form: principal input placeholder",
				})}
				description={intl.formatMessage(
					{
						defaultMessage: "The total amount of USDC to borrow, borrow limit: {amount} USDC",
						description: "Deal form: principal input description",
					},
					{ amount: borrowLimit }
				)}
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
				data-cy="deal-form-financing-fee-input"
				label={intl.formatMessage({
					defaultMessage: "Financing Fee",
					description: "Deal form: financing fee input label",
				})}
				placeholder={intl.formatMessage({
					defaultMessage: "%",
					description: "Deal form: financing fee input placeholder",
				})}
				description={intl.formatMessage({
					defaultMessage:
						"The annualized interest rate that needs to be repaid on top of the principal",
					description: "Deal form: financing fee input description",
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
				data-cy="deal-form-time-to-maturity-input"
				label={intl.formatMessage({
					defaultMessage: "Time To Maturity",
					description: "Deal form: time to maturity input label",
				})}
				placeholder={intl.formatMessage({
					defaultMessage: "Number of days",
					description: "Deal form: time to maturity input placeholder",
				})}
				description={intl.formatMessage({
					defaultMessage: "How many days before you have to pay back the principal",
					description: "Deal form: time to maturity input description",
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
			<Form.Item className="mb-0">
				<Button
					htmlType="submit"
					className="w-full md:w-max capitalize"
					data-cy="deal-form-submit-button"
				>
					{intl.formatMessage({
						defaultMessage: "Create Deal",
						description: "Deal form: submit button",
					})}
				</Button>
			</Form.Item>
		</Form>
	);
};

export default DealForm;
