import React, { FunctionComponent, useState } from "react";
import { Form } from "antd";
import { Stepper } from "@components/Stepper";
import { DealDetailsStep } from "@components/DealDetailsStep";
import { DealTranchesStep } from "@components/DealTranchesStep";
import { ReviewDealStep } from "@components/ReviewDeal";
import { defineMessages, useIntl } from "react-intl";
import { DealTrancheSettings, defaultTranches } from "@consts";
import { newDealDefaults } from "@consts";
import { TrancheFormValue } from "@credix_types/tranche.types";
import {
	seniorAPR,
	threeTrancheJuniorAPR,
	threeTrancheMezAPR,
	twoTrancheJuniorAPR,
} from "@utils/tranche.utils";
import { Fraction } from "@credix/credix-client";
import Big from "big.js";
import { ratioFormatter } from "@utils/format.utils";
import { repaymentSchedule as bulletSchedule } from "@utils/bullet.utils";
import { repaymentSchedule as amortizationSchedule } from "@utils/amortization.utils";

const dealFormDefaultValues = {
	trancheStructure: defaultTranches[defaultTranches.length - 1].value,
};

export enum dealFormValidationFields {
	dealName = "dealName",
	borrower = "borrower",
	principal = "principal",
	financingFee = "financingFee",
	timeToMaturity = "timeToMaturity",
	repaymentType = "repaymentType",
}

export const trancheSettingsFields = Object.values(TrancheFormValue);

export interface DealFormInput extends DealTrancheSettings {
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

	const onValuesChange = (changedValues, allValues) => {
		const changedValue = Object.keys(changedValues)[0];

		if (["principal", "financingFee", "timeToMaturity"].includes(changedValue)) {
			calculateAprs(allValues);
		}
	};

	const calculateAprs = (values) => {
		if (!values.timeToMaturity || !values.principal || !values.financingFee) {
			return;
		}

		const interestFee = new Fraction(Big(values.financingFee).toNumber(), 100);
		const totalPrincipal = Big(values.principal).toNumber();
		const timeToMaturity = Big(values.timeToMaturity).toNumber();

		// TODO: updating repayment type doesn't trigger onChange
		const totalInterest = (
			values["repaymentType"] === "amortization"
				? amortizationSchedule(totalPrincipal, interestFee, timeToMaturity)
				: bulletSchedule(totalPrincipal, interestFee, timeToMaturity)
		).reduce((acc, period: { interest: number; principal: number }) => {
			return (acc += period.interest);
		}, 0);

		calculateOneTrancheApr({ totalInterest, totalPrincipal, timeToMaturity, interestFee }, values);
		calculateTwoTrancheAprs({ totalInterest, totalPrincipal, timeToMaturity, interestFee }, values);
		calculateThreeTrancheAprs(
			{ totalInterest, totalPrincipal, timeToMaturity, interestFee },
			values
		);
	};

	const calculateOneTrancheApr = (
		{ totalInterest, totalPrincipal, timeToMaturity, interestFee },
		values
	) => {
		const poiSr = new Fraction(
			Big(values["twoTranche"]["Senior"]["percentageOfInterest"]).toNumber(),
			100
		);
		const popSr = new Fraction(
			Big(values["twoTranche"]["Senior"]["percentageOfPrincipal"]).toNumber(),
			100
		);

		const seniorApr = seniorAPR({
			percentageOfInterest: poiSr,
			percentageOfPrincipal: popSr,
			interestFee,
			totalInterest,
			totalPrincipal,
			timeToMaturity,
		});

		form.setFieldsValue({
			oneTranche: {
				Senior: {
					apr: ratioFormatter.format(seniorApr.toNumber()).replace("%", ""),
				},
			},
		});
	};

	const calculateTwoTrancheAprs = (
		{ totalInterest, totalPrincipal, timeToMaturity, interestFee },
		values
	) => {
		const poiSr = new Fraction(
			Big(values["twoTranche"]["Senior"]["percentageOfInterest"]).toNumber(),
			100
		);
		const popSr = new Fraction(
			Big(values["twoTranche"]["Senior"]["percentageOfPrincipal"]).toNumber(),
			100
		);

		const seniorApr = seniorAPR({
			percentageOfInterest: poiSr,
			percentageOfPrincipal: popSr,
			interestFee,
			totalInterest,
			totalPrincipal,
			timeToMaturity,
		});
		const mezApr = twoTrancheJuniorAPR({
			percentageOfInterestSenior: poiSr,
			percentageOfPrincipalSenior: popSr,
			interestFee,
			totalInterest,
			totalPrincipal,
			timeToMaturity,
		});

		form.setFieldsValue({
			twoTranche: {
				Senior: {
					apr: ratioFormatter.format(seniorApr.toNumber()).replace("%", ""),
				},
				Mezzanine: {
					apr: ratioFormatter.format(mezApr.toNumber()).replace("%", ""),
				},
			},
		});
	};

	const calculateThreeTrancheAprs = (
		{ totalInterest, totalPrincipal, timeToMaturity, interestFee },
		values
	) => {
		const poiMez = new Fraction(
			Big(values["threeTranche"]["Mezzanine"]["percentageOfInterest"]).toNumber(),
			100
		);
		const popMez = new Fraction(
			Big(values["threeTranche"]["Mezzanine"]["percentageOfPrincipal"]).toNumber(),
			100
		);
		const poiSr = new Fraction(
			Big(values["threeTranche"]["Senior"]["percentageOfInterest"]).toNumber(),
			100
		);
		const popSr = new Fraction(
			Big(values["threeTranche"]["Senior"]["percentageOfPrincipal"]).toNumber(),
			100
		);
		const juniorApr = threeTrancheJuniorAPR({
			percentageOfInterestSenior: poiSr,
			percentageOfPrincipalSenior: popSr,
			percentageOfInterestMez: poiMez,
			percentageOfPrincipalMez: popMez,
			interestFee,
			totalInterest,
			totalPrincipal,
			timeToMaturity,
		});
		const mezApr = threeTrancheMezAPR({
			percentageOfInterestMez: poiMez,
			percentageOfPrincipalMez: popMez,
			interestFee,
			totalInterest,
			totalPrincipal,
			timeToMaturity,
		});
		const seniorApr = seniorAPR({
			percentageOfInterest: poiSr,
			percentageOfPrincipal: popSr,
			interestFee,
			totalInterest,
			totalPrincipal,
			timeToMaturity,
		});

		// TODO: save factions to state and use those when creating tranches
		form.setFieldsValue({
			threeTranche: {
				Senior: {
					apr: ratioFormatter.format(seniorApr.toNumber()).replace("%", ""),
				},
				Mezzanine: {
					apr: ratioFormatter.format(mezApr.toNumber()).replace("%", ""),
				},
				Junior: {
					apr: ratioFormatter.format(juniorApr.toNumber()).replace("%", ""),
				},
			},
		});
	};
	const onNextStep = async (fieldsToValidate: string[], nextStep: number) => {
		await form.validateFields(fieldsToValidate).then(() => setCurrentStep(nextStep));
	};

	const initialValues = {
		...dealFormDefaultValues,
		...newDealDefaults,
	};

	return (
		<>
			<Stepper current={currentStep} steps={steps} />
			<div className="space-y-8">
				<div className="w-full h-[1px] mt-10  bg-neutral-105"></div>
				<Form
					name="deal"
					form={form}
					initialValues={initialValues}
					onFinish={onSubmit}
					layout="vertical"
					onValuesChange={onValuesChange}
				>
					<DealDetailsStep form={form} className={showStep(0)} onNextStep={onNextStep} />
					<DealTranchesStep form={form} className={showStep(1)} setCurrentStep={setCurrentStep} />
					<ReviewDealStep form={form} onBack={() => setCurrentStep(1)} className={showStep(2)} />
				</Form>
			</div>
		</>
	);
};

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

export default DealForm;
