import React, { FunctionComponent, useState } from "react";
import { Form } from "antd";
import { Stepper } from "@components/Stepper";
import { DealDetailsStep } from "@components/DealDetailsStep";
import { DealTranchesStep } from "@components/DealTranchesStep";
import { ReviewDealStep } from "@components/ReviewDeal";
import { useIntl } from "react-intl";
import { threeTrancheStructure } from "@consts";

const dealFormDefaultValues = {
	trancheStructure: threeTrancheStructure.value,
};

export interface DealFormInput {
	principal: number;
	financingFee: number;
	timeToMaturity: number;
	borrower: string;
	dealName: string;
	// TODO: replace with enum
	repaymentType: string;
	trancheStructure: string;
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
		intl.formatMessage({
			defaultMessage: "Deal details",
			description: "Deal form: deal details step title",
		}),
		intl.formatMessage({
			defaultMessage: "Tranche structure",
			description: "Deal form: tranche structure step title",
		}),
		intl.formatMessage({
			defaultMessage: "Review",
			description: "Deal form: review step title",
		}),
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
