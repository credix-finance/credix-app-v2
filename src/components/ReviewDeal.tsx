import React, { FunctionComponent } from "react";
import { useIntl } from "react-intl";
import { Button } from "@components/Button";
import { Form, FormInstance } from "antd";
import { Icon, IconDimension, IconName } from "./Icon";
import { classNames, compactFormatter } from "@utils/format.utils";
import { TrancheOption } from "./TrancheOption";
import { SelectorCard } from "./SelectorCard";
import { defaultTranches } from "@consts";
import { AmortizationRepaymentSchedule } from "./AmortizationRepaymentSchedule";
import { BulletLoanRepaymentSchedule } from "./BulletLoanRepaymentSchedule";

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
	const intl = useIntl();
	const tranche = defaultTranches.find(
		(tranche) => tranche.value === form.getFieldValue("trancheStructure")
	);

	className = classNames([className, "space-y-8"]);

	return (
		<div className={className}>
			<div>
				{intl.formatMessage({
					defaultMessage: "Please review details",
					description: "New deal: review step title",
				})}
			</div>
			<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
				<DealDetail
					icon="key"
					title={intl.formatMessage({
						defaultMessage: "Public key",
						description: "New deal: review public key",
					})}
					value={form.getFieldValue("borrower")}
					className="col-span-2"
					valueSize={ValueSize.SMALL}
				/>
				<div className="col-span-2"></div>
				<DealDetail
					title={intl.formatMessage({
						defaultMessage: "Deal name",
						description: "New deal: review deal name",
					})}
					value={form.getFieldValue("dealName")}
					className="col-span-1"
				/>
				<DealDetail
					title={intl.formatMessage({
						defaultMessage: "Principal",
						description: "New deal: review deal principal",
					})}
					value={`${compactFormatter.format(Number(form.getFieldValue("principal")))} USDC`}
					className="col-span-1"
				/>
				<DealDetail
					title={intl.formatMessage({
						defaultMessage: "Financing fee",
						description: "New deal: review deal financing fee",
					})}
					value={`${form.getFieldValue("financingFee")}%`}
					className="col-span-1"
				/>
				<DealDetail
					title={intl.formatMessage({
						defaultMessage: "Time to maturity",
						description: "New deal: review deal time to maturity",
					})}
					value={`${form.getFieldValue("timeToMaturity")} DAYS`}
					className="col-span-1"
				/>
				{form.getFieldValue("repaymentType") === "amortization" && (
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
						checked={false}
						isInteractive={false}
						showContent={true}
						className="col-span-4"
					/>
				)}
				{form.getFieldValue("repaymentType") === "bullet" && (
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
						checked={false}
						isInteractive={false}
						showContent={true}
						className="col-span-4"
					/>
				)}
				{tranche && (
					<SelectorCard
						content={<TrancheOption trancheData={tranche.trancheData} />}
						value={tranche.value}
						title={tranche.title}
						checked={false}
						isInteractive={false}
						showContent={true}
						className="col-span-4"
					/>
				)}
			</div>
			<div className="w-full h-[1px] mt-10  bg-neutral-105"></div>
			<div className="flex space-x-6">
				<Button type="default" onClick={onBack}>
					{intl.formatMessage({
						defaultMessage: "Back",
						description: "Neaw deal: back button",
					})}
				</Button>
				<Form.Item className="mb-0">
					<Button htmlType="submit" className="w-full md:w-max capitalize">
						{intl.formatMessage({
							defaultMessage: "Create Deal",
							description: "Deal form: submit button",
						})}
					</Button>
				</Form.Item>
			</div>
		</div>
	);
};
