import React, { FunctionComponent, useState } from "react";
import { Form } from "antd";
import { Stepper } from "@components/Stepper";
import { DealDetailsStep } from "@components/DealDetailsStep";
import { useIntl } from "react-intl";

export interface DealFormInput {
	principal: number;
	financingFee: number;
	timeToMaturity: number;
	borrower: string;
	dealName: string;
}

interface DealFormProps {
	onSubmit: ({
		principal,
		financingFee,
		timeToMaturity,
		borrower,
		dealName,
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
		try {
			await form.validateFields(fieldsToValidate);
			setCurrentStep(nextStep);
		} catch {
			// Form has errors, dont go to next step
		}
	};

	return (
		<>
			<Stepper current={currentStep} steps={steps} />
			<div className="space-y-8">
				<div className="w-full h-[1px] mt-10  bg-neutral-105"></div>
				<Form name="deal" form={form} onFinish={onSubmit} layout="vertical">
					<DealDetailsStep form={form} className={showStep(0)} onNextStep={onNextStep} />
				</Form>
			</div>
		</>
	);
};

export default DealForm;
