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
import { compactRatioFormatter, ratioFormatter } from "@utils/format.utils";
import { repaymentSchedule as bulletSchedule } from "@utils/bullet.utils";
import { repaymentSchedule as amortizationSchedule } from "@utils/amortization.utils";
import { useStore } from "@state/useStore";
import { marketSelector } from "@state/selectors";
import { RepaymentScheduleType } from "@credix_types/repaymentschedule.types";

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
	const market = useStore(marketSelector);
	const performanceFee = market?.defaultInterestFee;

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

	const getSharedOnChangeFormValues = (): {
		totalPrincipal: number;
		timeToMaturity: number;
		totalInterest: number;
	} => {
		const {
			financingFee,
			principal,
			timeToMaturity: ttm,
			repaymentType,
		} = form.getFieldsValue(["financingFee", "principal", "timeToMaturity", "repaymentType"]);

		const interestFee = new Fraction(Big(financingFee).toNumber(), 100);
		const totalPrincipal = Big(principal).toNumber();
		const timeToMaturity = Big(ttm).toNumber();

		const totalInterest = (
			repaymentType === RepaymentScheduleType.AMORTIZATION
				? amortizationSchedule(totalPrincipal, interestFee, timeToMaturity)
				: bulletSchedule(totalPrincipal, interestFee, timeToMaturity)
		).reduce((acc, period: { interest: number; principal: number }) => {
			return (acc += period.interest);
		}, 0);

		return { totalPrincipal, timeToMaturity, totalInterest };
	};

	const onTwoTrancheSeniorAprChange = () => {
		// get form values
		const {
			twoTranche: {
				Senior: { apr: aprSenior, percentageOfPrincipal: percentageOfPrincipalSenior },
			},
		} = form.getFieldsValue([
			["twoTranche", "Senior", "percentageOfPrincipal"],
			["twoTranche", "Senior", "apr"],
		]);

		const sharedValues = getSharedOnChangeFormValues();

		const poiSenior = twoTrancheSeniorPercentageOfInterest({
			apr: new Fraction(aprSenior, 100),
			percentageOfPrincipal: new Fraction(percentageOfPrincipalSenior, 100),
			performanceFee,
			...sharedValues,
		});

		const poiMez = 1 - poiSenior.toNumber();
		const aprMez = twoTrancheJuniorAPR({
			percentageOfInterestSenior: new Fraction(poiSenior.toNumber(), 1),
			percentageOfPrincipalSenior: new Fraction(percentageOfPrincipalSenior, 100),
			performanceFee,
			...sharedValues,
		});

		form.setFieldsValue({
			twoTranche: {
				Senior: {
					percentageOfInterest: compactRatioFormatter(poiSenior.toNumber()),
				},
				Mezzanine: {
					percentageOfInterest: compactRatioFormatter(poiMez),
					apr: compactRatioFormatter(aprMez.toNumber()),
				},
			},
		});
	};

	const onTwoTrancheSeniorPOIChange = () => {
		// get form values
		const {
			twoTranche: {
				Senior: { percentageOfInterest: percentageOfInterestSenior, apr: aprSenior },
			},
		} = form.getFieldsValue([
			["twoTranche", "Senior", "percentageOfInterest"],
			["twoTranche", "Senior", "apr"],
		]);

		const sharedValues = getSharedOnChangeFormValues();
		// calculate percentage of principal for senior
		const popSenior = twoTrancheSeniorPercentageOfPrincipal({
			percentageOfInterest: new Fraction(percentageOfInterestSenior, 100),
			apr: new Fraction(aprSenior, 100),
			performanceFee,
			...sharedValues,
		});

		const poiMez = new Fraction(100 - percentageOfInterestSenior, 100);
		const popMez = 1 - popSenior.toNumber();
		const aprMez = twoTrancheJuniorAPR({
			percentageOfInterestSenior: new Fraction(percentageOfInterestSenior, 100),
			percentageOfPrincipalSenior: popSenior,
			performanceFee,
			...sharedValues,
		});

		form.setFieldsValue({
			twoTranche: {
				Senior: {
					percentageOfPrincipal: compactRatioFormatter(popSenior.toNumber()),
				},
				Mezzanine: {
					percentageOfInterest: compactRatioFormatter(poiMez.toNumber()),
					percentageOfPrincipal: compactRatioFormatter(popMez),
					apr: compactRatioFormatter(aprMez.toNumber()),
				},
			},
		});
	};

	const onTwoTrancheSeniorPOPChange = () => {
		// get form values
		const {
			twoTranche: {
				Senior: { percentageOfPrincipal: popSenior, percentageOfInterest: poiSenior },
			},
		} = form.getFieldsValue([
			["twoTranche", "Senior", "percentageOfPrincipal"],
			["twoTranche", "Senior", "percentageOfInterest"],
		]);

		const sharedValues = getSharedOnChangeFormValues();

		// calculate apr for senior
		const aprSenior = seniorAPR({
			percentageOfPrincipal: new Fraction(popSenior, 100),
			percentageOfInterest: new Fraction(poiSenior, 100),
			performanceFee,
			...sharedValues,
		});

		// update percentage of interest for mezzanine
		const popMez = new Fraction(100 - popSenior, 100);
		const aprMez = twoTrancheJuniorAPR({
			percentageOfInterestSenior: new Fraction(poiSenior, 100),
			percentageOfPrincipalSenior: new Fraction(popSenior, 100),
			performanceFee,
			...sharedValues,
		});

		// recalculate
		form.setFieldsValue({
			twoTranche: {
				Senior: {
					apr: compactRatioFormatter(aprSenior.toNumber()),
				},
				Mezzanine: {
					percentageOfPrincipal: compactRatioFormatter(popMez.toNumber()),
					apr: compactRatioFormatter(aprMez.toNumber()),
				},
			},
		});
	};

	const onTwoTrancheMezzanineAprChange = () => {
		// get form values
		const {
			twoTranche: {
				Senior: { percentageOfPrincipal: popSenior },
				Mezzanine: { apr: aprMez },
			},
		} = form.getFieldsValue([
			["twoTranche", "Mezzanine", "percentageOfInterest"],
			["twoTranche", "Mezzanine", "percentageOfPrincipal"],
			["twoTranche", "Mezzanine", "apr"],
			["twoTranche", "Senior", "percentageOfPrincipal"],
		]);

		const sharedValues = getSharedOnChangeFormValues();
		// calculate percentage of interest for mezzanine
		const poiMez = twoTrancheJuniorPercentageOfInterest({
			apr: new Fraction(aprMez, 100),
			percentageOfPrincipalSenior: new Fraction(popSenior, 100),
			performanceFee,
			...sharedValues,
		});
		const poiSenior = new Fraction(1 - poiMez.toNumber(), 1);
		const aprSenior = seniorAPR({
			percentageOfPrincipal: new Fraction(popSenior, 100),
			percentageOfInterest: poiSenior,
			performanceFee,
			...sharedValues,
		});

		form.setFieldsValue({
			twoTranche: {
				Senior: {
					apr: compactRatioFormatter(aprSenior.toNumber()),
					percentageOfInterest: compactRatioFormatter(poiSenior.toNumber()),
				},
				Mezzanine: {
					percentageOfInterest: compactRatioFormatter(poiMez.toNumber()),
				},
			},
		});
	};

	const onTwoTrancheMezzaninePOPChange = () => {
		// get form values
		const {
			twoTranche: {
				Senior: { percentageOfInterest: poiSenior },
				Mezzanine: { percentageOfPrincipal: popMez },
			},
		} = form.getFieldsValue([
			["twoTranche", "Mezzanine", "percentageOfPrincipal"],
			["twoTranche", "Senior", "percentageOfInterest"],
		]);

		const sharedValues = getSharedOnChangeFormValues();

		const popSenior = new Fraction(100 - popMez, 100);
		// calculate percentage of interest for mezzanine
		const aprMez = twoTrancheJuniorAPR({
			percentageOfInterestSenior: new Fraction(poiSenior, 100),
			percentageOfPrincipalSenior: popSenior,
			performanceFee,
			...sharedValues,
		});
		const aprSenior = seniorAPR({
			percentageOfPrincipal: popSenior,
			percentageOfInterest: new Fraction(poiSenior, 100),
			performanceFee,
			...sharedValues,
		});

		form.setFieldsValue({
			twoTranche: {
				Senior: {
					apr: compactRatioFormatter(aprSenior.toNumber()),
					percentageOfPrincipal: compactRatioFormatter(popSenior.toNumber()),
				},
				Mezzanine: {
					apr: compactRatioFormatter(aprMez.toNumber()),
				},
			},
		});
	};

	const onTwoTrancheMezzaninePOIChange = () => {
		// get form values
		const {
			twoTranche: {
				Mezzanine: { apr: aprMez, percentageOfInterest: poiMez },
			},
		} = form.getFieldsValue([
			["twoTranche", "Mezzanine", "apr"],
			["twoTranche", "Mezzanine", "percentageOfInterest"],
		]);

		const sharedValues = getSharedOnChangeFormValues();

		const poiSenior = new Fraction(100 - poiMez, 100);
		const popMez = twoTrancheJuniorPercentageOfPrincipal({
			apr: new Fraction(aprMez, 100),
			percentageOfInterestSenior: poiSenior,
			performanceFee,
			...sharedValues,
		});
		const popSenior = new Fraction(1 - popMez.toNumber(), 1);
		const aprSenior = seniorAPR({
			percentageOfPrincipal: popSenior,
			percentageOfInterest: poiSenior,
			performanceFee,
			...sharedValues,
		});

		form.setFieldsValue({
			twoTranche: {
				Senior: {
					apr: compactRatioFormatter(aprSenior.toNumber()),
					percentageOfPrincipal: compactRatioFormatter(popSenior.toNumber()),
					percentageOfInterest: compactRatioFormatter(poiSenior.toNumber()),
				},
				Mezzanine: {
					percentageOfPrincipal: compactRatioFormatter(popMez.toNumber()),
					percentageOfInterest: compactRatioFormatter(new Fraction(poiMez, 100).toNumber()),
				},
			},
		});
	};

	const onThreeTrancheSeniorAprChange = () => {
		// get form values
		const {
			threeTranche: {
				Senior: { apr: aprSenior, percentageOfPrincipal: popSenior },
				Mezzanine: { percentageOfInterest: poiMez, percentageOfPrincipal: popMez },
			},
		} = form.getFieldsValue([
			["threeTranche", "Senior", "apr"],
			["threeTranche", "Senior", "percentageOfPrincipal"],
			["threeTranche", "Mezzanine", "percentageOfInterest"],
			["threeTranche", "Mezzanine", "percentageOfPrincipal"],
		]);

		const sharedValues = getSharedOnChangeFormValues();

		const poiSenior = threeTrancheSeniorPercentageOfInterest({
			apr: new Fraction(aprSenior, 100),
			percentageOfPrincipal: new Fraction(popSenior, 100),
			performanceFee,
			...sharedValues,
		});

		const poiJunior = 100 - poiMez - poiSenior.toNumber() * 100;
		const aprJunior = threeTrancheJuniorAPR({
			percentageOfInterestSenior: poiSenior,
			percentageOfPrincipalSenior: new Fraction(popSenior, 100),
			percentageOfInterestMez: new Fraction(poiMez, 100),
			percentageOfPrincipalMez: new Fraction(popMez, 100),
			performanceFee,
			...sharedValues,
		});

		form.setFieldsValue({
			threeTranche: {
				Senior: {
					percentageOfInterest: compactRatioFormatter(poiSenior.toNumber()),
				},
				Junior: {
					percentageOfInterest: compactRatioFormatter(poiJunior / 100),
					apr: compactRatioFormatter(aprJunior.toNumber()),
				},
			},
		});
	};

	const onThreeTrancheSeniorPOPChange = () => {
		// get form values
		const {
			threeTranche: {
				Senior: { percentageOfPrincipal: popSenior, apr: aprSenior },
				Mezzanine: { percentageOfInterest: poiMez, percentageOfPrincipal: popMez },
			},
		} = form.getFieldsValue([
			["threeTranche", "Senior", "percentageOfPrincipal"],
			["threeTranche", "Senior", "apr"],
			["threeTranche", "Mezzanine", "percentageOfInterest"],
			["threeTranche", "Mezzanine", "percentageOfPrincipal"],
		]);

		const sharedValues = getSharedOnChangeFormValues();

		const poiSenior = threeTrancheSeniorPercentageOfInterest({
			percentageOfPrincipal: new Fraction(popSenior, 100),
			apr: new Fraction(aprSenior, 100),
			performanceFee,
			...sharedValues,
		});

		const popJunior = 100 - popMez - popSenior;
		const poiJunior = 100 - poiMez - poiSenior.toNumber() * 100;

		const aprJunior = threeTrancheJuniorAPR({
			percentageOfInterestSenior: poiSenior,
			percentageOfPrincipalSenior: new Fraction(popSenior, 100),
			percentageOfPrincipalMez: new Fraction(popMez, 100),
			percentageOfInterestMez: new Fraction(poiMez, 100),
			performanceFee,
			...sharedValues,
		});

		form.setFieldsValue({
			threeTranche: {
				Senior: {
					percentageOfInterest: compactRatioFormatter(poiSenior.toNumber()),
				},
				Junior: {
					percentageOfPrincipal: compactRatioFormatter(new Fraction(popJunior, 100).toNumber()),
					percentageOfInterest: compactRatioFormatter(new Fraction(poiJunior, 100).toNumber()),
					apr: compactRatioFormatter(aprJunior.toNumber()),
				},
			},
		});
	};

	const onThreeTrancheSeniorPOIChange = () => {
		// get form values
		const {
			threeTranche: {
				Senior: { percentageOfInterest: poiSenior, percentageOfPrincipal: popSenior },
				Mezzanine: { percentageOfInterest: poiMez, percentageOfPrincipal: popMez },
			},
		} = form.getFieldsValue([
			["threeTranche", "Senior", "percentageOfInterest"],
			["threeTranche", "Senior", "percentageOfPrincipal"],
			["threeTranche", "Mezzanine", "percentageOfInterest"],
			["threeTranche", "Mezzanine", "percentageOfPrincipal"],
		]);

		const sharedValues = getSharedOnChangeFormValues();

		const aprSenior = seniorAPR({
			percentageOfInterest: new Fraction(poiSenior, 100),
			percentageOfPrincipal: new Fraction(popSenior, 100),
			performanceFee,
			...sharedValues,
		});

		const popJunior = 100 - popMez - popSenior;
		const poiJunior = 100 - poiMez - poiSenior;

		const aprJunior = threeTrancheJuniorAPR({
			percentageOfInterestSenior: new Fraction(poiSenior, 100),
			percentageOfPrincipalSenior: new Fraction(popSenior, 100),
			percentageOfPrincipalMez: new Fraction(popMez, 100),
			percentageOfInterestMez: new Fraction(poiMez, 100),
			performanceFee,
			...sharedValues,
		});

		form.setFieldsValue({
			threeTranche: {
				Senior: {
					apr: compactRatioFormatter(aprSenior.toNumber()),
				},
				Junior: {
					percentageOfPrincipal: compactRatioFormatter(new Fraction(popJunior, 100).toNumber()),
					percentageOfInterest: compactRatioFormatter(poiJunior / 100),
					apr: compactRatioFormatter(aprJunior.toNumber()),
				},
			},
		});
	};

	const onThreeTrancheMezzanineAprChange = () => {
		// get form values
		const {
			threeTranche: {
				Senior: { percentageOfPrincipal: popSenior, percentageOfInterest: poiSenior },
				Mezzanine: { percentageOfPrincipal: popMez, apr: aprMez },
			},
		} = form.getFieldsValue([
			["threeTranche", "Senior", "percentageOfPrincipal"],
			["threeTranche", "Senior", "percentageOfInterest"],
			["threeTranche", "Mezzanine", "apr"],
			["threeTranche", "Mezzanine", "percentageOfPrincipal"],
		]);

		const sharedValues = getSharedOnChangeFormValues();

		const poiMez = threeTrancheMezPercentageOfInterest({
			percentageOfPrincipalMez: new Fraction(popMez, 100),
			apr: new Fraction(aprMez, 100),
			performanceFee,
			...sharedValues,
		});

		const poiJunior = 100 - poiMez.toNumber() * 100 - poiSenior;
		const aprJunior = threeTrancheJuniorAPR({
			percentageOfPrincipalSenior: new Fraction(popSenior, 100),
			percentageOfInterestSenior: new Fraction(poiSenior, 100),
			percentageOfInterestMez: poiMez,
			percentageOfPrincipalMez: new Fraction(popMez, 100),
			performanceFee,
			...sharedValues,
		});

		form.setFieldsValue({
			threeTranche: {
				Mezzanine: {
					percentageOfInterest: compactRatioFormatter(poiMez.toNumber()),
					apr: compactRatioFormatter(aprMez / 100),
				},
				Junior: {
					percentageOfInterest: compactRatioFormatter(poiJunior / 100),
					apr: compactRatioFormatter(aprJunior.toNumber()),
				},
			},
		});
	};

	const onThreeTrancheMezzaninePOPChange = () => {
		// get form values
		const {
			threeTranche: {
				Senior: { percentageOfInterest: poiSenior, percentageOfPrincipal: popSenior },
				Mezzanine: { percentageOfPrincipal: popMez, apr: aprMez },
			},
		} = form.getFieldsValue([
			["threeTranche", "Senior", "percentageOfInterest"],
			["threeTranche", "Senior", "percentageOfPrincipal"],
			["threeTranche", "Mezzanine", "percentageOfPrincipal"],
			["threeTranche", "Mezzanine", "apr"],
		]);

		const sharedValues = getSharedOnChangeFormValues();

		const poiMez = threeTrancheMezPercentageOfInterest({
			apr: new Fraction(aprMez, 100),
			percentageOfPrincipalMez: new Fraction(popMez, 100),
			performanceFee,
			...sharedValues,
		});

		const poiJunior = 100 - poiMez.toNumber() * 100 - poiSenior;
		const popJunior = 100 - popMez - popSenior;
		const aprJunior = threeTrancheJuniorAPR({
			percentageOfPrincipalSenior: new Fraction(popSenior, 100),
			percentageOfInterestSenior: new Fraction(poiSenior, 100),
			percentageOfInterestMez: poiMez,
			percentageOfPrincipalMez: new Fraction(popMez, 100),
			performanceFee,
			...sharedValues,
		});

		form.setFieldsValue({
			threeTranche: {
				Mezzanine: {
					percentageOfInterest: compactRatioFormatter(poiMez.toNumber()),
				},
				Junior: {
					apr: compactRatioFormatter(aprJunior.toNumber()),
					percentageOfInterest: compactRatioFormatter(poiJunior / 100),
					percentageOfPrincipal: compactRatioFormatter(popJunior / 100),
				},
			},
		});
	};

	const onThreeTrancheMezzaninePOIChange = () => {
		// get form values
		const {
			threeTranche: {
				Senior: { percentageOfPrincipal: popSenior, percentageOfInterest: poiSenior },
				Mezzanine: { percentageOfPrincipal: popMez, percentageOfInterest: poiMez },
			},
		} = form.getFieldsValue([
			["threeTranche", "Senior", "percentageOfPrincipal"],
			["threeTranche", "Senior", "percentageOfInterest"],
			["threeTranche", "Mezzanine", "percentageOfPrincipal"],
			["threeTranche", "Mezzanine", "percentageOfInterest"],
		]);

		const sharedValues = getSharedOnChangeFormValues();

		const aprMez = threeTrancheMezAPR({
			percentageOfPrincipalMez: new Fraction(popMez, 100),
			percentageOfInterestMez: new Fraction(poiMez, 100),
			performanceFee,
			...sharedValues,
		});
		const poiJunior = 100 - poiMez - poiSenior;
		const aprJunior = threeTrancheJuniorAPR({
			percentageOfPrincipalSenior: new Fraction(popSenior, 100),
			percentageOfInterestSenior: new Fraction(poiSenior, 100),
			percentageOfInterestMez: new Fraction(poiMez, 100),
			percentageOfPrincipalMez: new Fraction(popMez, 100),
			performanceFee,
			...sharedValues,
		});

		form.setFieldsValue({
			threeTranche: {
				Mezzanine: {
					apr: compactRatioFormatter(aprMez.toNumber()),
				},
				Junior: {
					apr: compactRatioFormatter(aprJunior.toNumber()),
					percentageOfInterest: compactRatioFormatter(poiJunior / 100),
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
			performanceFee,
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
			performanceFee,
			totalInterest,
			totalPrincipal,
			timeToMaturity,
		});
		const mezApr = twoTrancheJuniorAPR({
			percentageOfInterestSenior: poiSr,
			percentageOfPrincipalSenior: popSr,
			performanceFee,
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
			performanceFee,
			totalInterest,
			totalPrincipal,
			timeToMaturity,
		});
		const mezApr = threeTrancheMezAPR({
			percentageOfInterestMez: poiMez,
			percentageOfPrincipalMez: popMez,
			performanceFee,
			totalInterest,
			totalPrincipal,
			timeToMaturity,
		});
		const seniorApr = seniorAPR({
			percentageOfInterest: poiSr,
			percentageOfPrincipal: popSr,
			performanceFee,
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
