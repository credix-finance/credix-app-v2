import React, { FunctionComponent, useState } from "react";
import { Form } from "antd";
import { Stepper } from "@components/Stepper";
import { DealDetailsStep } from "@components/DealDetailsStep";
import { DealTranchesStep } from "@components/DealTranchesStep";
import { ReviewDealStep } from "@components/ReviewDeal";
import { defineMessages, useIntl } from "react-intl";
import { threeTrancheStructure } from "@consts";

const MESSAGES = defineMessages({
	dealDetailsStep: {
		defaultMessage: "Deal details",
		description: "Deal form: deal details step title",
	},
	trancheStructureStep: {
		defaultMessage: "Tranche structure",
		description: "Deal form: tranche structure step title",
	},
	reviewStep: {
		defaultMessage: "Review",
		description: "Deal form: review step title",
	},
});

const dealFormDefaultValues = {
	trancheStructure: threeTrancheStructure.value,
};

export enum dealFormValidationFields {
	dealName = "dealName",
	borrower = "borrower",
	principal = "principal",
	financingFee = "financingFee",
	timeToMaturity = "timeToMaturity",
	repaymentType = "repaymentType",
}

export interface DealFormInput {
	principal: number;
	financingFee: number;
	timeToMaturity: number;
	borrower: string;
	dealName: string;
	// TODO: replace with enum
	repaymentType: string;
	trancheStructure: string;
	trueWaterfall: boolean;
	slashInterestToPrincipal: boolean;
	slashPrincipalToInterest: boolean;
}

interface DealFormProps {
	onSubmit: ({
		principal,
		financingFee,
		timeToMaturity,
		borrower,
		dealName,
		repaymentType,
		trancheStructure,
	}: DealFormInput) => void;
}

const DealForm: FunctionComponent<DealFormProps> = ({ onSubmit }) => {
	const [currentStep, setCurrentStep] = useState<number>(0);
	const [form] = Form.useForm();
	const intl = useIntl();
	const steps = [
		intl.formatMessage(MESSAGES.dealDetailsStep),
		intl.formatMessage(MESSAGES.trancheStructureStep),
		intl.formatMessage(MESSAGES.reviewStep),
	];

	const showStep = (step: number) => {
		if (step === currentStep) {
			return "block";
		}

		return "hidden";
	};

	const onNextStep = async (fieldsToValidate: string[], nextStep: number) => {
		await form.validateFields(fieldsToValidate).then(() => setCurrentStep(nextStep));
	};

	return (
		<>
			<Stepper current={currentStep} steps={steps} />
			<div className="space-y-8">
				<div className="w-full h-[1px] mt-10  bg-neutral-105"></div>
				<Form
					name="deal"
					form={form}
					initialValues={dealFormDefaultValues}
					onFinish={onSubmit}
					layout="vertical"
				>
					<DealDetailsStep form={form} className={showStep(0)} onNextStep={onNextStep} />
					<DealTranchesStep form={form} className={showStep(1)} setCurrentStep={setCurrentStep} />
					<ReviewDealStep form={form} onBack={() => setCurrentStep(1)} className={showStep(2)} />
				</Form>
			</div>
		</>
	);
};

export default DealForm;
