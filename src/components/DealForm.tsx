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
	twoTrancheJuniorPercentageOfInterest,
	twoTrancheJuniorPercentageOfPrincipal,
	twoTrancheSeniorPercentageOfInterest,
	twoTrancheSeniorPercentageOfPrincipal,
	threeTrancheSeniorPercentageOfInterest,
	threeTrancheMezPercentageOfInterest,
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

		if (trancheSettingsFields.find((field) => field === changedValue)) {
			const tranche = Object.keys(changedValues[changedValue])[0];
			const field = Object.keys(changedValues[changedValue][tranche])[0];
			const update = trancheUpdateMap[changedValue][tranche][field];
			update();
		}
	};

	const onTwoTrancheSeniorAprChange = () => {
		// get form values
		const {
			financingFee,
			principal,
			timeToMaturity,
			repaymentType,
			twoTranche: {
				Senior: { apr: aprSenior, percentageOfPrincipal: percentageOfPrincipalSenior },
			},
		} = form.getFieldsValue([
			"financingFee",
			"principal",
			"timeToMaturity",
			"repaymentType",
			["twoTranche", "Senior", "percentageOfPrincipal"],
			["twoTranche", "Senior", "apr"],
		]);

		const interestFee = new Fraction(Big(financingFee).toNumber(), 100);
		const totalPrincipal = Big(principal).toNumber();
		const ttm = Big(timeToMaturity).toNumber();

		const totalInterest = (
			repaymentType === "amortization"
				? amortizationSchedule(totalPrincipal, interestFee, timeToMaturity)
				: bulletSchedule(totalPrincipal, interestFee, timeToMaturity)
		).reduce((acc, period: { interest: number; principal: number }) => {
			return (acc += period.interest);
		}, 0);

		// calculate percentage of interest for senior
		const poiSenior = twoTrancheSeniorPercentageOfInterest({
			apr: new Fraction(aprSenior, 100),
			percentageOfPrincipal: new Fraction(percentageOfPrincipalSenior, 100),
			interestFee: new Fraction(10, 100),
			timeToMaturity: ttm,
			totalPrincipal,
			totalInterest,
		});
		// update percentage of interest for mezzanine
		const poiMez = 1 - poiSenior.toNumber();
		// recalculate apr for mezzanine
		const aprMez = twoTrancheJuniorAPR({
			percentageOfInterestSenior: new Fraction(poiSenior.toNumber(), 1),
			percentageOfPrincipalSenior: new Fraction(percentageOfPrincipalSenior, 100),
			interestFee: new Fraction(10, 100),
			timeToMaturity: ttm,
			totalPrincipal,
			totalInterest,
		});

		form.setFieldsValue({
			twoTranche: {
				Senior: {
					percentageOfInterest: ratioFormatter.format(poiSenior.toNumber()).replace("%", ""),
				},
				Mezzanine: {
					percentageOfInterest: ratioFormatter.format(poiMez).replace("%", ""),
					apr: ratioFormatter.format(aprMez.toNumber()).replace("%", ""),
				},
			},
		});
	};

	const onTwoTrancheSeniorPOIChange = () => {
		// get form values
		const {
			financingFee,
			principal,
			timeToMaturity,
			repaymentType,
			twoTranche: {
				Senior: { percentageOfInterest: percentageOfInterestSenior, apr: aprSenior },
			},
		} = form.getFieldsValue([
			"financingFee",
			"principal",
			"timeToMaturity",
			"repaymentType",
			["twoTranche", "Senior", "percentageOfInterest"],
			["twoTranche", "Senior", "apr"],
		]);

		const interestFee = new Fraction(Big(financingFee).toNumber(), 100);
		const totalPrincipal = Big(principal).toNumber();
		const ttm = Big(timeToMaturity).toNumber();

		const totalInterest = (
			repaymentType === "amortization"
				? amortizationSchedule(totalPrincipal, interestFee, timeToMaturity)
				: bulletSchedule(totalPrincipal, interestFee, timeToMaturity)
		).reduce((acc, period: { interest: number; principal: number }) => {
			return (acc += period.interest);
		}, 0);

		// calculate percentage of principal for senior
		const popSenior = twoTrancheSeniorPercentageOfPrincipal({
			percentageOfInterest: new Fraction(percentageOfInterestSenior, 100),
			apr: new Fraction(aprSenior, 100),
			interestFee: new Fraction(interestFee.toNumber(), 100),
			timeToMaturity: ttm,
			totalPrincipal,
			totalInterest,
		});

		const poiMez = new Fraction(100 - percentageOfInterestSenior, 100);
		const popMez = 1 - popSenior.toNumber();
		const aprMez = twoTrancheJuniorAPR({
			percentageOfInterestSenior: new Fraction(percentageOfInterestSenior, 100),
			percentageOfPrincipalSenior: popSenior,
			interestFee: new Fraction(interestFee.toNumber(), 100),
			timeToMaturity: ttm,
			totalPrincipal,
			totalInterest,
		});

		form.setFieldsValue({
			twoTranche: {
				Senior: {
					percentageOfPrincipal: ratioFormatter.format(popSenior.toNumber()).replace("%", ""),
				},
				Mezzanine: {
					percentageOfInterest: ratioFormatter.format(poiMez.toNumber()).replace("%", ""),
					percentageOfPrincipal: ratioFormatter.format(popMez).replace("%", ""),
					apr: ratioFormatter.format(aprMez.toNumber()).replace("%", ""),
				},
			},
		});
	};

	const onTwoTrancheSeniorPOPChange = () => {
		// get form values
		const {
			financingFee,
			principal,
			timeToMaturity,
			repaymentType,
			twoTranche: {
				Senior: { percentageOfPrincipal: popSenior, percentageOfInterest: poiSenior },
			},
		} = form.getFieldsValue([
			"financingFee",
			"principal",
			"timeToMaturity",
			"repaymentType",
			["twoTranche", "Senior", "percentageOfPrincipal"],
			["twoTranche", "Senior", "percentageOfInterest"],
		]);

		const interestFee = new Fraction(Big(financingFee).toNumber(), 100);
		const totalPrincipal = Big(principal).toNumber();
		const ttm = Big(timeToMaturity).toNumber();

		const totalInterest = (
			repaymentType === "amortization"
				? amortizationSchedule(totalPrincipal, interestFee, timeToMaturity)
				: bulletSchedule(totalPrincipal, interestFee, timeToMaturity)
		).reduce((acc, period: { interest: number; principal: number }) => {
			return (acc += period.interest);
		}, 0);

		// calculate apr for senior
		const aprSenior = seniorAPR({
			percentageOfPrincipal: new Fraction(popSenior, 100),
			percentageOfInterest: new Fraction(poiSenior, 100),
			interestFee: new Fraction(interestFee.toNumber(), 100),
			timeToMaturity: ttm,
			totalPrincipal,
			totalInterest,
		});

		// update percentage of interest for mezzanine
		const popMez = new Fraction(100 - popSenior, 100);
		const aprMez = twoTrancheJuniorAPR({
			percentageOfInterestSenior: new Fraction(poiSenior, 100),
			percentageOfPrincipalSenior: new Fraction(popSenior, 100),
			interestFee: new Fraction(interestFee.toNumber(), 100),
			timeToMaturity: ttm,
			totalPrincipal,
			totalInterest,
		});

		// recalculate
		form.setFieldsValue({
			twoTranche: {
				Senior: {
					apr: ratioFormatter.format(aprSenior.toNumber()).replace("%", ""),
				},
				Mezzanine: {
					percentageOfPrincipal: ratioFormatter.format(popMez.toNumber()).replace("%", ""),
					apr: ratioFormatter.format(aprMez.toNumber()).replace("%", ""),
				},
			},
		});
	};

	const onTwoTrancheMezzanineAprChange = () => {
		// get form values
		const {
			financingFee,
			principal,
			timeToMaturity,
			repaymentType,
			twoTranche: {
				Senior: { percentageOfPrincipal: popSenior },
				Mezzanine: { apr: aprMez },
			},
		} = form.getFieldsValue([
			"financingFee",
			"principal",
			"timeToMaturity",
			"repaymentType",
			["twoTranche", "Mezzanine", "percentageOfInterest"],
			["twoTranche", "Mezzanine", "percentageOfPrincipal"],
			["twoTranche", "Mezzanine", "apr"],
			["twoTranche", "Senior", "percentageOfPrincipal"],
		]);

		const interestFee = new Fraction(Big(financingFee).toNumber(), 100);
		const totalPrincipal = Big(principal).toNumber();
		const ttm = Big(timeToMaturity).toNumber();

		const totalInterest = (
			repaymentType === "amortization"
				? amortizationSchedule(totalPrincipal, interestFee, timeToMaturity)
				: bulletSchedule(totalPrincipal, interestFee, timeToMaturity)
		).reduce((acc, period: { interest: number; principal: number }) => {
			return (acc += period.interest);
		}, 0);

		// calculate percentage of interest for mezzanine
		const poiMez = twoTrancheJuniorPercentageOfInterest({
			apr: new Fraction(aprMez, 100),
			percentageOfPrincipalSenior: new Fraction(popSenior, 100),
			interestFee: new Fraction(interestFee.toNumber(), 100),
			timeToMaturity: ttm,
			totalPrincipal,
			totalInterest,
		});
		const poiSenior = new Fraction(1 - poiMez.toNumber(), 1);
		const aprSenior = seniorAPR({
			percentageOfPrincipal: new Fraction(popSenior, 100),
			percentageOfInterest: poiSenior,
			interestFee: new Fraction(interestFee.toNumber(), 100),
			timeToMaturity: ttm,
			totalPrincipal,
			totalInterest,
		});

		form.setFieldsValue({
			twoTranche: {
				Senior: {
					apr: ratioFormatter.format(aprSenior.toNumber()).replace("%", ""),
					percentageOfInterest: ratioFormatter.format(poiSenior.toNumber()).replace("%", ""),
				},
				Mezzanine: {
					percentageOfInterest: ratioFormatter.format(poiMez.toNumber()).replace("%", ""),
				},
			},
		});
	};

	const onTwoTrancheMezzaninePOPChange = () => {
		// get form values
		const {
			financingFee,
			principal,
			timeToMaturity,
			repaymentType,
			twoTranche: {
				Senior: { percentageOfInterest: poiSenior },
				Mezzanine: { percentageOfPrincipal: popMez },
			},
		} = form.getFieldsValue([
			"financingFee",
			"principal",
			"timeToMaturity",
			"repaymentType",
			["twoTranche", "Mezzanine", "percentageOfPrincipal"],
			["twoTranche", "Senior", "percentageOfInterest"],
		]);

		const interestFee = new Fraction(Big(financingFee).toNumber(), 100);
		const totalPrincipal = Big(principal).toNumber();
		const ttm = Big(timeToMaturity).toNumber();

		const totalInterest = (
			repaymentType === "amortization"
				? amortizationSchedule(totalPrincipal, interestFee, timeToMaturity)
				: bulletSchedule(totalPrincipal, interestFee, timeToMaturity)
		).reduce((acc, period: { interest: number; principal: number }) => {
			return (acc += period.interest);
		}, 0);

		const popSenior = new Fraction(100 - popMez, 100);
		// calculate percentage of interest for mezzanine
		const aprMez = twoTrancheJuniorAPR({
			percentageOfInterestSenior: new Fraction(poiSenior, 100),
			percentageOfPrincipalSenior: popSenior,
			interestFee: new Fraction(interestFee.toNumber(), 100),
			timeToMaturity: ttm,
			totalPrincipal,
			totalInterest,
		});
		const aprSenior = seniorAPR({
			percentageOfPrincipal: popSenior,
			percentageOfInterest: new Fraction(poiSenior, 100),
			interestFee: new Fraction(interestFee.toNumber(), 100),
			timeToMaturity: ttm,
			totalPrincipal,
			totalInterest,
		});

		form.setFieldsValue({
			twoTranche: {
				Senior: {
					apr: ratioFormatter.format(aprSenior.toNumber()).replace("%", ""),
					percentageOfPrincipal: ratioFormatter.format(popSenior.toNumber()).replace("%", ""),
				},
				Mezzanine: {
					apr: ratioFormatter.format(aprMez.toNumber()).replace("%", ""),
				},
			},
		});
	};

	const onTwoTrancheMezzaninePOIChange = () => {
		// get form values
		const {
			financingFee,
			principal,
			timeToMaturity,
			repaymentType,
			twoTranche: {
				Mezzanine: { apr: aprMez, percentageOfInterest: poiMez },
			},
		} = form.getFieldsValue([
			"financingFee",
			"principal",
			"timeToMaturity",
			"repaymentType",
			["twoTranche", "Mezzanine", "apr"],
			["twoTranche", "Mezzanine", "percentageOfInterest"],
		]);

		const interestFee = new Fraction(Big(financingFee).toNumber(), 100);
		const totalPrincipal = Big(principal).toNumber();
		const ttm = Big(timeToMaturity).toNumber();

		const totalInterest = (
			repaymentType === "amortization"
				? amortizationSchedule(totalPrincipal, interestFee, timeToMaturity)
				: bulletSchedule(totalPrincipal, interestFee, timeToMaturity)
		).reduce((acc, period: { interest: number; principal: number }) => {
			return (acc += period.interest);
		}, 0);

		const poiSenior = new Fraction(100 - poiMez, 100);
		const popMez = twoTrancheJuniorPercentageOfPrincipal({
			apr: new Fraction(aprMez, 100),
			percentageOfInterestSenior: poiSenior,
			interestFee: new Fraction(interestFee.toNumber(), 100),
			timeToMaturity: ttm,
			totalPrincipal,
			totalInterest,
		});
		const popSenior = new Fraction(1 - popMez.toNumber(), 1);
		const aprSenior = seniorAPR({
			percentageOfPrincipal: popSenior,
			percentageOfInterest: poiSenior,
			interestFee: new Fraction(interestFee.toNumber(), 100),
			timeToMaturity: ttm,
			totalPrincipal,
			totalInterest,
		});

		form.setFieldsValue({
			twoTranche: {
				Senior: {
					apr: ratioFormatter.format(aprSenior.toNumber()).replace("%", ""),
					percentageOfPrincipal: ratioFormatter.format(popSenior.toNumber()).replace("%", ""),
					percentageOfInterest: ratioFormatter.format(poiSenior.toNumber()).replace("%", ""),
				},
				Mezzanine: {
					percentageOfPrincipal: ratioFormatter.format(popMez.toNumber()).replace("%", ""),
					percentageOfInterest: ratioFormatter
						.format(new Fraction(poiMez, 100).toNumber())
						.replace("%", ""),
				},
			},
		});
	};

	const onThreeTrancheSeniorAprChange = () => {
		// get form values
		const {
			financingFee,
			principal,
			timeToMaturity,
			repaymentType,
			threeTranche: {
				Senior: { apr: aprSenior, percentageOfPrincipal: popSenior },
				Mezzanine: { percentageOfInterest: poiMez, percentageOfPrincipal: popMez },
			},
		} = form.getFieldsValue([
			"financingFee",
			"principal",
			"timeToMaturity",
			"repaymentType",
			["threeTranche", "Senior", "apr"],
			["threeTranche", "Senior", "percentageOfPrincipal"],
			["threeTranche", "Mezzanine", "percentageOfInterest"],
			["threeTranche", "Mezzanine", "percentageOfPrincipal"],
			["threeTranche", "Junior", "percentageOfPrincipal"],
		]);

		const interestFee = new Fraction(Big(financingFee).toNumber(), 100);
		const totalPrincipal = Big(principal).toNumber();
		const ttm = Big(timeToMaturity).toNumber();

		const totalInterest = (
			repaymentType === "amortization"
				? amortizationSchedule(totalPrincipal, interestFee, timeToMaturity)
				: bulletSchedule(totalPrincipal, interestFee, timeToMaturity)
		).reduce((acc, period: { interest: number; principal: number }) => {
			return (acc += period.interest);
		}, 0);

		const poiSenior = threeTrancheSeniorPercentageOfInterest({
			apr: new Fraction(aprSenior, 100),
			percentageOfPrincipal: new Fraction(popSenior, 100),
			interestFee,
			timeToMaturity: ttm,
			totalInterest,
			totalPrincipal,
		});

		const poiJunior = 100 - poiMez - poiSenior.toNumber() * 100;
		const aprJunior = threeTrancheJuniorAPR({
			percentageOfInterestSenior: poiSenior,
			percentageOfPrincipalSenior: new Fraction(popSenior, 100),
			percentageOfInterestMez: new Fraction(poiMez, 100),
			percentageOfPrincipalMez: new Fraction(popMez, 100),
			interestFee,
			timeToMaturity: ttm,
			totalInterest,
			totalPrincipal,
		});

		form.setFieldsValue({
			threeTranche: {
				Senior: {
					percentageOfInterest: ratioFormatter.format(poiSenior.toNumber()).replace("%", ""),
				},
				Junior: {
					percentageOfInterest: ratioFormatter.format(poiJunior / 100).replace("%", ""),
					apr: ratioFormatter.format(aprJunior.toNumber()).replace("%", ""),
				},
			},
		});
	};

	const onThreeTrancheSeniorPOPChange = () => {
		// get form values
		const {
			financingFee,
			principal,
			timeToMaturity,
			repaymentType,
			threeTranche: {
				Senior: { percentageOfPrincipal: popSenior, apr: aprSenior },
				Mezzanine: { percentageOfInterest: poiMez, percentageOfPrincipal: popMez },
			},
		} = form.getFieldsValue([
			"financingFee",
			"principal",
			"timeToMaturity",
			"repaymentType",
			["threeTranche", "Senior", "percentageOfPrincipal"],
			["threeTranche", "Senior", "apr"],
			["threeTranche", "Mezzanine", "percentageOfInterest"],
			["threeTranche", "Mezzanine", "percentageOfPrincipal"],
		]);

		const interestFee = new Fraction(Big(financingFee).toNumber(), 100);
		const totalPrincipal = Big(principal).toNumber();
		const ttm = Big(timeToMaturity).toNumber();

		const totalInterest = (
			repaymentType === "amortization"
				? amortizationSchedule(totalPrincipal, interestFee, timeToMaturity)
				: bulletSchedule(totalPrincipal, interestFee, timeToMaturity)
		).reduce((acc, period: { interest: number; principal: number }) => {
			return (acc += period.interest);
		}, 0);

		const poiSenior = threeTrancheSeniorPercentageOfInterest({
			percentageOfPrincipal: new Fraction(popSenior, 100),
			apr: new Fraction(aprSenior, 100),
			interestFee,
			timeToMaturity: ttm,
			totalInterest,
			totalPrincipal,
		});

		const popJunior = 100 - popMez - popSenior;
		const poiJunior = 100 - poiMez - poiSenior.toNumber() * 100;

		const aprJunior = threeTrancheJuniorAPR({
			percentageOfInterestSenior: poiSenior,
			percentageOfPrincipalSenior: new Fraction(popSenior, 100),
			percentageOfPrincipalMez: new Fraction(popMez, 100),
			percentageOfInterestMez: new Fraction(poiMez, 100),
			interestFee,
			timeToMaturity: ttm,
			totalInterest,
			totalPrincipal,
		});

		form.setFieldsValue({
			threeTranche: {
				Senior: {
					percentageOfInterest: ratioFormatter.format(poiSenior.toNumber()).replace("%", ""),
				},
				Junior: {
					percentageOfPrincipal: ratioFormatter
						.format(new Fraction(popJunior, 100).toNumber())
						.replace("%", ""),
					percentageOfInterest: ratioFormatter
						.format(new Fraction(poiJunior, 100).toNumber())
						.replace("%", ""),
					apr: ratioFormatter.format(aprJunior.toNumber()).replace("%", ""),
				},
			},
		});
	};

	const onThreeTrancheSeniorPOIChange = () => {
		// get form values
		const {
			financingFee,
			principal,
			timeToMaturity,
			repaymentType,
			threeTranche: {
				Senior: { percentageOfInterest: poiSenior, percentageOfPrincipal: popSenior },
				Mezzanine: { percentageOfInterest: poiMez, percentageOfPrincipal: popMez },
			},
		} = form.getFieldsValue([
			"financingFee",
			"principal",
			"timeToMaturity",
			"repaymentType",
			["threeTranche", "Senior", "percentageOfInterest"],
			["threeTranche", "Senior", "percentageOfPrincipal"],
			["threeTranche", "Mezzanine", "percentageOfInterest"],
			["threeTranche", "Mezzanine", "percentageOfPrincipal"],
		]);

		const interestFee = new Fraction(Big(financingFee).toNumber(), 100);
		const totalPrincipal = Big(principal).toNumber();
		const ttm = Big(timeToMaturity).toNumber();

		const totalInterest = (
			repaymentType === "amortization"
				? amortizationSchedule(totalPrincipal, interestFee, timeToMaturity)
				: bulletSchedule(totalPrincipal, interestFee, timeToMaturity)
		).reduce((acc, period: { interest: number; principal: number }) => {
			return (acc += period.interest);
		}, 0);

		const aprSenior = seniorAPR({
			percentageOfInterest: new Fraction(poiSenior, 100),
			percentageOfPrincipal: new Fraction(popSenior, 100),
			interestFee,
			timeToMaturity: ttm,
			totalInterest,
			totalPrincipal,
		});

		const popJunior = 100 - popMez - popSenior;
		const poiJunior = 100 - poiMez - poiSenior;

		const aprJunior = threeTrancheJuniorAPR({
			percentageOfInterestSenior: new Fraction(poiSenior, 100),
			percentageOfPrincipalSenior: new Fraction(popSenior, 100),
			percentageOfPrincipalMez: new Fraction(popMez, 100),
			percentageOfInterestMez: new Fraction(poiMez, 100),
			interestFee,
			timeToMaturity: ttm,
			totalInterest,
			totalPrincipal,
		});

		form.setFieldsValue({
			threeTranche: {
				Senior: {
					apr: ratioFormatter.format(aprSenior.toNumber()).replace("%", ""),
				},
				Junior: {
					percentageOfPrincipal: ratioFormatter
						.format(new Fraction(popJunior, 100).toNumber())
						.replace("%", ""),
					percentageOfInterest: ratioFormatter.format(poiJunior / 100).replace("%", ""),
					apr: ratioFormatter.format(aprJunior.toNumber()).replace("%", ""),
				},
			},
		});
	};

	const onThreeTrancheMezzanineAprChange = () => {
		// get form values
		const {
			financingFee,
			principal,
			timeToMaturity,
			repaymentType,
			threeTranche: {
				Senior: { percentageOfPrincipal: popSenior, percentageOfInterest: poiSenior },
				Mezzanine: { percentageOfPrincipal: popMez, apr: aprMez },
			},
		} = form.getFieldsValue([
			"financingFee",
			"principal",
			"timeToMaturity",
			"repaymentType",
			["threeTranche", "Senior", "percentageOfPrincipal"],
			["threeTranche", "Senior", "percentageOfInterest"],
			["threeTranche", "Mezzanine", "apr"],
			["threeTranche", "Mezzanine", "percentageOfPrincipal"],
		]);

		const interestFee = new Fraction(Big(financingFee).toNumber(), 100);
		const totalPrincipal = Big(principal).toNumber();
		const ttm = Big(timeToMaturity).toNumber();

		const totalInterest = (
			repaymentType === "amortization"
				? amortizationSchedule(totalPrincipal, interestFee, timeToMaturity)
				: bulletSchedule(totalPrincipal, interestFee, timeToMaturity)
		).reduce((acc, period: { interest: number; principal: number }) => {
			return (acc += period.interest);
		}, 0);

		const poiMez = threeTrancheMezPercentageOfInterest({
			percentageOfPrincipalMez: new Fraction(popMez, 100),
			apr: new Fraction(aprMez, 100),
			interestFee,
			timeToMaturity: ttm,
			totalInterest,
			totalPrincipal,
		});

		const poiJunior = 100 - poiMez.toNumber() * 100 - poiSenior;
		const aprJunior = threeTrancheJuniorAPR({
			percentageOfPrincipalSenior: new Fraction(popSenior, 100),
			percentageOfInterestSenior: new Fraction(poiSenior, 100),
			percentageOfInterestMez: poiMez,
			percentageOfPrincipalMez: new Fraction(popMez, 100),
			interestFee,
			timeToMaturity: ttm,
			totalInterest,
			totalPrincipal,
		});

		form.setFieldsValue({
			threeTranche: {
				Mezzanine: {
					percentageOfInterest: ratioFormatter.format(poiMez.toNumber()).replace("%", ""),
					apr: ratioFormatter.format(aprMez / 100).replace("%", ""),
				},
				Junior: {
					percentageOfInterest: ratioFormatter.format(poiJunior / 100).replace("%", ""),
					apr: ratioFormatter.format(aprJunior.toNumber()).replace("%", ""),
				},
			},
		});
	};

	const onThreeTrancheMezzaninePOPChange = () => {
		// get form values
		const {
			financingFee,
			principal,
			timeToMaturity,
			repaymentType,
			threeTranche: {
				Senior: { percentageOfInterest: poiSenior, percentageOfPrincipal: popSenior },
				Mezzanine: { percentageOfPrincipal: popMez, apr: aprMez },
			},
		} = form.getFieldsValue([
			"financingFee",
			"principal",
			"timeToMaturity",
			"repaymentType",
			["threeTranche", "Senior", "percentageOfInterest"],
			["threeTranche", "Senior", "percentageOfPrincipal"],
			["threeTranche", "Mezzanine", "percentageOfPrincipal"],
			["threeTranche", "Mezzanine", "apr"],
		]);

		const interestFee = new Fraction(Big(financingFee).toNumber(), 100);
		const totalPrincipal = Big(principal).toNumber();
		const ttm = Big(timeToMaturity).toNumber();

		const totalInterest = (
			repaymentType === "amortization"
				? amortizationSchedule(totalPrincipal, interestFee, timeToMaturity)
				: bulletSchedule(totalPrincipal, interestFee, timeToMaturity)
		).reduce((acc, period: { interest: number; principal: number }) => {
			return (acc += period.interest);
		}, 0);

		const poiMez = threeTrancheMezPercentageOfInterest({
			apr: new Fraction(aprMez, 100),
			percentageOfPrincipalMez: new Fraction(popMez, 100),
			interestFee,
			timeToMaturity: ttm,
			totalInterest,
			totalPrincipal,
		});

		const poiJunior = 100 - poiMez.toNumber() * 100 - poiSenior;
		const popJunior = 100 - popMez - popSenior;
		const aprJunior = threeTrancheJuniorAPR({
			percentageOfPrincipalSenior: new Fraction(popSenior, 100),
			percentageOfInterestSenior: new Fraction(poiSenior, 100),
			percentageOfInterestMez: poiMez,
			percentageOfPrincipalMez: new Fraction(popMez, 100),
			interestFee,
			timeToMaturity: ttm,
			totalInterest,
			totalPrincipal,
		});

		form.setFieldsValue({
			threeTranche: {
				Mezzanine: {
					percentageOfInterest: ratioFormatter.format(poiMez.toNumber()).replace("%", ""),
				},
				Junior: {
					apr: ratioFormatter.format(aprJunior.toNumber()).replace("%", ""),
					percentageOfInterest: ratioFormatter.format(poiJunior / 100).replace("%", ""),
					percentageOfPrincipal: ratioFormatter.format(popJunior / 100).replace("%", ""),
				},
			},
		});
	};

	const onThreeTrancheMezzaninePOIChange = () => {
		// get form values
		const {
			financingFee,
			principal,
			timeToMaturity,
			repaymentType,
			threeTranche: {
				Senior: { percentageOfPrincipal: popSenior, percentageOfInterest: poiSenior },
				Mezzanine: { percentageOfPrincipal: popMez, percentageOfInterest: poiMez },
			},
		} = form.getFieldsValue([
			"financingFee",
			"principal",
			"timeToMaturity",
			"repaymentType",
			["threeTranche", "Senior", "percentageOfPrincipal"],
			["threeTranche", "Senior", "percentageOfInterest"],
			["threeTranche", "Mezzanine", "percentageOfPrincipal"],
			["threeTranche", "Mezzanine", "percentageOfInterest"],
		]);

		const interestFee = new Fraction(Big(financingFee).toNumber(), 100);
		const totalPrincipal = Big(principal).toNumber();
		const ttm = Big(timeToMaturity).toNumber();

		const totalInterest = (
			repaymentType === "amortization"
				? amortizationSchedule(totalPrincipal, interestFee, timeToMaturity)
				: bulletSchedule(totalPrincipal, interestFee, timeToMaturity)
		).reduce((acc, period: { interest: number; principal: number }) => {
			return (acc += period.interest);
		}, 0);

		const aprMez = threeTrancheMezAPR({
			percentageOfPrincipalMez: new Fraction(popMez, 100),
			percentageOfInterestMez: new Fraction(poiMez, 100),
			interestFee,
			timeToMaturity: ttm,
			totalInterest,
			totalPrincipal,
		});
		const poiJunior = 100 - poiMez - poiSenior;
		const aprJunior = threeTrancheJuniorAPR({
			percentageOfPrincipalSenior: new Fraction(popSenior, 100),
			percentageOfInterestSenior: new Fraction(poiSenior, 100),
			percentageOfInterestMez: new Fraction(poiMez, 100),
			percentageOfPrincipalMez: new Fraction(popMez, 100),
			interestFee,
			timeToMaturity: ttm,
			totalInterest,
			totalPrincipal,
		});

		form.setFieldsValue({
			threeTranche: {
				Mezzanine: {
					apr: ratioFormatter.format(aprMez.toNumber()).replace("%", ""),
				},
				Junior: {
					apr: ratioFormatter.format(aprJunior.toNumber()).replace("%", ""),
					percentageOfInterest: ratioFormatter.format(poiJunior / 100).replace("%", ""),
				},
			},
		});
	};

	const trancheUpdateMap = {
		twoTranche: {
			Senior: {
				apr: onTwoTrancheSeniorAprChange,
				percentageOfInterest: onTwoTrancheSeniorPOIChange,
				percentageOfPrincipal: onTwoTrancheSeniorPOPChange,
			},
			Mezzanine: {
				apr: onTwoTrancheMezzanineAprChange,
				percentageOfPrincipal: onTwoTrancheMezzaninePOPChange,
				percentageOfInterest: onTwoTrancheMezzaninePOIChange,
			},
		},
		threeTranche: {
			Senior: {
				apr: onThreeTrancheSeniorAprChange,
				percentageOfPrincipal: onThreeTrancheSeniorPOPChange,
				percentageOfInterest: onThreeTrancheSeniorPOIChange,
			},
			Mezzanine: {
				apr: onThreeTrancheMezzanineAprChange,
				percentageOfPrincipal: onThreeTrancheMezzaninePOPChange,
				percentageOfInterest: onThreeTrancheMezzaninePOIChange,
			},
		},
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
