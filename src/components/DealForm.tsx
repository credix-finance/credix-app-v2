import React, { FunctionComponent, SetStateAction, Dispatch, useState } from "react";
import { Form } from "antd";
import { Stepper } from "@components/Stepper";
import { DealDetailsStep } from "@components/DealDetailsStep";
import { DealTranchesStep } from "@components/DealTranchesStep";
import { ReviewDealStep } from "@components/ReviewDeal";
import { defineMessages, useIntl } from "react-intl";
import { DealTrancheSettings } from "@consts";
import { newDealDefaults } from "@consts";
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
import { compactRatioFormatter } from "@utils/format.utils";
import { repaymentSchedule as bulletSchedule } from "@utils/bullet.utils";
import { repaymentSchedule as amortizationSchedule } from "@utils/amortization.utils";
import { useStore } from "@state/useStore";
import { marketSelector } from "@state/selectors";
import { RepaymentScheduleType } from "@credix_types/repaymentschedule.types";

type TrancheUpdateMap = {
	twoTranche: {
		Senior: {
			apr: () => void;
			percentageOfInterest: () => void;
			percentageOfPrincipal: () => void;
		};
		Junior: {
			apr: () => void;
			percentageOfPrincipal: () => void;
			percentageOfInterest: () => void;
			earlyWithdrawalInterest: () => void;
			earlyWithdrawalPrincipal: () => void;
		};
	};
	threeTranche: {
		Senior: {
			apr: () => void;
			percentageOfPrincipal: () => void;
			percentageOfInterest: () => void;
		};
		Mezzanine: {
			apr: () => void;
			percentageOfPrincipal: () => void;
			percentageOfInterest: () => void;
			earlyWithdrawalInterest: () => void;
			earlyWithdrawalPrincipal: () => void;
		};
		Junior: {
			earlyWithdrawalInterest: () => void;
			earlyWithdrawalPrincipal: () => void;
		};
	};
};

enum DealFormField {
	DealName = "dealName",
	Borrower = "borrower",
	Principal = "principal",
	FinancingFee = "financingFee",
	TimeToMaturity = "timeToMaturity",
	RepaymentType = "repaymentType",
	OneTranche = "oneTranche",
	TwoTranche = "twoTranche",
	ThreeTranche = "threeTranche",
}

export enum DealFormValidationField {
	DealName = DealFormField.DealName,
	Borrower = DealFormField.Borrower,
	Principal = DealFormField.Principal,
	FinancingFee = DealFormField.FinancingFee,
	TimeToMaturity = DealFormField.TimeToMaturity,
	RepaymentType = DealFormField.RepaymentType,
}
export const trancheSettingsFields = [
	DealFormField.OneTranche,
	DealFormField.TwoTranche,
	DealFormField.ThreeTranche,
];

enum TrancheName {
	Senior = "Senior",
	Mezzanine = "Mezzanine",
	Junior = "Junior",
}

export enum TrancheFormField {
	Apr = "apr",
	PercentageOfPrincipal = "percentageOfPrincipal",
	PercentageOfInterest = "percentageOfInterest",
	EarlyWithdrawalInterest = "earlyWithdrawalInterest",
	EarlyWithdrawalPrincipal = "earlyWithdrawalPrincipal",
}

const dealFormDefaultValues = {
	trancheStructure: trancheSettingsFields[2],
};

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
		// Get the name of the changed field
		const formItemKey = Object.keys(changedValues)[0] as DealFormField;

		if (
			[
				DealFormField.Principal,
				DealFormField.FinancingFee,
				DealFormField.TimeToMaturity,
				DealFormField.RepaymentType,
			].includes(formItemKey)
		) {
			calculateAprs(allValues);
			return;
		}

		if (trancheSettingsFields.includes(formItemKey)) {
			// Get the name of the tranche the updated field belongs to
			const tranche = Object.keys(changedValues[formItemKey])[0];

			// Get the name of the field that was updated
			const field = Object.keys(changedValues[formItemKey][tranche])[0];

			/**
			 * Get the function to update the tranche settings.
			 * trancheUpdateMap will return a function based on the tranche structure, tranche and field that was updated.
			 * e.g.: threeTranche, Senior, apr.
			 * where formItemKey = "threeTranche",
			 * 			tranche = "Senior",
			 * 			field = "apr"
			 */
			const updateFunction = trancheUpdateMap[formItemKey][tranche][field];
			updateFunction();
		}
	};

	const getCommonDealValues = (): {
		totalPrincipal: number;
		timeToMaturity: number;
		totalInterest: number;
	} => {
		const {
			financingFee,
			principal,
			timeToMaturity: ttm,
			repaymentType,
		} = form.getFieldsValue([
			DealFormField.FinancingFee,
			DealFormField.Principal,
			DealFormField.TimeToMaturity,
			DealFormField.RepaymentType,
		]);

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
			[DealFormField.TwoTranche, TrancheName.Senior, TrancheFormField.PercentageOfPrincipal],
			[DealFormField.TwoTranche, TrancheName.Senior, TrancheFormField.Apr],
		]);

		const sharedValues = getCommonDealValues();

		const poiSenior = twoTrancheSeniorPercentageOfInterest({
			apr: new Fraction(aprSenior, 100),
			percentageOfPrincipal: new Fraction(percentageOfPrincipalSenior, 100),
			performanceFee,
			...sharedValues,
		});

		const poiJunior = 1 - poiSenior.toNumber();
		const aprJunior = twoTrancheJuniorAPR({
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
				Junior: {
					percentageOfInterest: compactRatioFormatter(poiJunior),
					apr: compactRatioFormatter(aprJunior.toNumber()),
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
			[DealFormField.TwoTranche, TrancheName.Senior, TrancheFormField.PercentageOfInterest],
			[DealFormField.TwoTranche, TrancheName.Senior, TrancheFormField.Apr],
		]);

		const sharedValues = getCommonDealValues();
		// calculate percentage of principal for senior
		const popSenior = twoTrancheSeniorPercentageOfPrincipal({
			percentageOfInterest: new Fraction(percentageOfInterestSenior, 100),
			apr: new Fraction(aprSenior, 100),
			performanceFee,
			...sharedValues,
		});

		const poiJunior = new Fraction(100 - percentageOfInterestSenior, 100);
		const popJunior = 1 - popSenior.toNumber();
		const aprJunior = twoTrancheJuniorAPR({
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
				Junior: {
					percentageOfInterest: compactRatioFormatter(poiJunior.toNumber()),
					percentageOfPrincipal: compactRatioFormatter(popJunior),
					apr: compactRatioFormatter(aprJunior.toNumber()),
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
			[DealFormField.TwoTranche, TrancheName.Senior, TrancheFormField.PercentageOfPrincipal],
			[DealFormField.TwoTranche, TrancheName.Senior, TrancheFormField.PercentageOfInterest],
		]);

		const sharedValues = getCommonDealValues();

		// calculate apr for senior
		const aprSenior = seniorAPR({
			percentageOfPrincipal: new Fraction(popSenior, 100),
			percentageOfInterest: new Fraction(poiSenior, 100),
			performanceFee,
			...sharedValues,
		});

		// update percentage of interest for junior
		const popJunior = new Fraction(100 - popSenior, 100);
		const aprJunior = twoTrancheJuniorAPR({
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
				Junior: {
					percentageOfPrincipal: compactRatioFormatter(popJunior.toNumber()),
					apr: compactRatioFormatter(aprJunior.toNumber()),
				},
			},
		});
	};

	const onTwoTrancheJuniorAprChange = () => {
		// get form values
		const {
			twoTranche: {
				Senior: { percentageOfPrincipal: popSenior },
				Junior: { apr: aprJunior },
			},
		} = form.getFieldsValue([
			[DealFormField.TwoTranche, TrancheName.Senior, TrancheFormField.PercentageOfPrincipal],
			[DealFormField.TwoTranche, TrancheName.Junior, TrancheFormField.Apr],
		]);

		const sharedValues = getCommonDealValues();
		// calculate percentage of interest for mezzanine
		const poiJunior = twoTrancheJuniorPercentageOfInterest({
			apr: new Fraction(aprJunior, 100),
			percentageOfPrincipalSenior: new Fraction(popSenior, 100),
			performanceFee,
			...sharedValues,
		});
		const poiSenior = new Fraction(1 - poiJunior.toNumber(), 1);
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
				Junior: {
					percentageOfInterest: compactRatioFormatter(poiJunior.toNumber()),
				},
			},
		});
	};

	const onTwoTrancheJuniorPOPChange = () => {
		// get form values
		const {
			twoTranche: {
				Senior: { percentageOfInterest: poiSenior },
				Junior: { percentageOfPrincipal: popJunior },
			},
		} = form.getFieldsValue([
			[DealFormField.TwoTranche, TrancheName.Junior, TrancheFormField.PercentageOfPrincipal],
			[DealFormField.TwoTranche, TrancheName.Senior, TrancheFormField.PercentageOfInterest],
		]);

		const sharedValues = getCommonDealValues();

		const popSenior = new Fraction(100 - popJunior, 100);
		// calculate percentage of interest for mezzanine
		const aprJunior = twoTrancheJuniorAPR({
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
				Junior: {
					apr: compactRatioFormatter(aprJunior.toNumber()),
				},
			},
		});
	};

	const onTwoTrancheJuniorPOIChange = () => {
		// get form values
		const {
			twoTranche: {
				Junior: { apr: aprJunior, percentageOfInterest: poiJunior },
			},
		} = form.getFieldsValue([
			[DealFormField.TwoTranche, TrancheName.Junior, TrancheFormField.Apr],
			[DealFormField.TwoTranche, TrancheName.Junior, TrancheFormField.PercentageOfInterest],
		]);

		const sharedValues = getCommonDealValues();

		const poiSenior = new Fraction(100 - poiJunior, 100);
		const popMez = twoTrancheJuniorPercentageOfPrincipal({
			apr: new Fraction(aprJunior, 100),
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
				Junior: {
					percentageOfPrincipal: compactRatioFormatter(popMez.toNumber()),
					percentageOfInterest: compactRatioFormatter(new Fraction(poiJunior, 100).toNumber()),
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
			[DealFormField.ThreeTranche, TrancheName.Senior, TrancheFormField.Apr],
			[DealFormField.ThreeTranche, TrancheName.Senior, TrancheFormField.PercentageOfPrincipal],
			[DealFormField.ThreeTranche, TrancheName.Mezzanine, TrancheFormField.PercentageOfInterest],
			[DealFormField.ThreeTranche, TrancheName.Mezzanine, TrancheFormField.PercentageOfPrincipal],
		]);

		const sharedValues = getCommonDealValues();

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
					percentageOfInterest: compactRatioFormatter(new Fraction(poiJunior, 100).toNumber()),
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
			[DealFormField.ThreeTranche, TrancheName.Senior, TrancheFormField.PercentageOfPrincipal],
			[DealFormField.ThreeTranche, TrancheName.Senior, TrancheFormField.Apr],
			[DealFormField.ThreeTranche, TrancheName.Mezzanine, TrancheFormField.PercentageOfInterest],
			[DealFormField.ThreeTranche, TrancheName.Mezzanine, TrancheFormField.PercentageOfPrincipal],
		]);

		const sharedValues = getCommonDealValues();

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
			[DealFormField.ThreeTranche, TrancheName.Senior, TrancheFormField.PercentageOfInterest],
			[DealFormField.ThreeTranche, TrancheName.Senior, TrancheFormField.PercentageOfPrincipal],
			[DealFormField.ThreeTranche, TrancheName.Mezzanine, TrancheFormField.PercentageOfInterest],
			[DealFormField.ThreeTranche, TrancheName.Mezzanine, TrancheFormField.PercentageOfPrincipal],
		]);

		const sharedValues = getCommonDealValues();

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
					percentageOfInterest: compactRatioFormatter(new Fraction(poiJunior, 100).toNumber()),
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
			[DealFormField.ThreeTranche, TrancheName.Senior, TrancheFormField.PercentageOfPrincipal],
			[DealFormField.ThreeTranche, TrancheName.Senior, TrancheFormField.PercentageOfInterest],
			[DealFormField.ThreeTranche, TrancheName.Mezzanine, TrancheFormField.Apr],
			[DealFormField.ThreeTranche, TrancheName.Mezzanine, TrancheFormField.PercentageOfPrincipal],
		]);

		const sharedValues = getCommonDealValues();

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
					apr: compactRatioFormatter(new Fraction(aprMez, 100).toNumber()),
				},
				Junior: {
					percentageOfInterest: compactRatioFormatter(new Fraction(poiJunior, 100).toNumber()),
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
			[DealFormField.ThreeTranche, TrancheName.Senior, TrancheFormField.PercentageOfInterest],
			[DealFormField.ThreeTranche, TrancheName.Senior, TrancheFormField.PercentageOfPrincipal],
			[DealFormField.ThreeTranche, TrancheName.Mezzanine, TrancheFormField.PercentageOfPrincipal],
			[DealFormField.ThreeTranche, TrancheName.Mezzanine, TrancheFormField.Apr],
		]);

		const sharedValues = getCommonDealValues();

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
					percentageOfInterest: compactRatioFormatter(new Fraction(poiJunior, 100).toNumber()),
					percentageOfPrincipal: compactRatioFormatter(new Fraction(popJunior, 100).toNumber()),
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
			[DealFormField.ThreeTranche, TrancheName.Senior, TrancheFormField.PercentageOfPrincipal],
			[DealFormField.ThreeTranche, TrancheName.Senior, TrancheFormField.PercentageOfInterest],
			[DealFormField.ThreeTranche, TrancheName.Mezzanine, TrancheFormField.PercentageOfPrincipal],
			[DealFormField.ThreeTranche, TrancheName.Mezzanine, TrancheFormField.PercentageOfInterest],
		]);

		const sharedValues = getCommonDealValues();

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

	const trancheUpdateMap: TrancheUpdateMap = {
		twoTranche: {
			Senior: {
				apr: onTwoTrancheSeniorAprChange,
				percentageOfInterest: onTwoTrancheSeniorPOIChange,
				percentageOfPrincipal: onTwoTrancheSeniorPOPChange,
			},
			Junior: {
				apr: onTwoTrancheJuniorAprChange,
				percentageOfPrincipal: onTwoTrancheJuniorPOPChange,
				percentageOfInterest: onTwoTrancheJuniorPOIChange,
				earlyWithdrawalInterest: () => null,
				earlyWithdrawalPrincipal: () => null,
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
				earlyWithdrawalInterest: () => null,
				earlyWithdrawalPrincipal: () => null,
			},
			Junior: {
				earlyWithdrawalInterest: () => null,
				earlyWithdrawalPrincipal: () => null,
			},
		},
	};

	const calculateAprs = (values) => {
		if (
			!values.timeToMaturity ||
			!values.principal ||
			!values.financingFee ||
			!values.repaymentType
		) {
			return;
		}

		const sharedValues = getCommonDealValues();

		calculateOneTrancheApr(sharedValues, values);
		calculateTwoTrancheAprs(sharedValues, values);
		calculateThreeTrancheAprs(sharedValues, values);
	};

	const calculateOneTrancheApr = ({ totalInterest, totalPrincipal, timeToMaturity }, values) => {
		const poiSr = new Fraction(
			Big(
				values[DealFormField.TwoTranche][TrancheName.Senior][TrancheFormField.PercentageOfInterest]
			).toNumber(),
			100
		);
		const popSr = new Fraction(
			Big(
				values[DealFormField.TwoTranche][TrancheName.Senior][TrancheFormField.PercentageOfPrincipal]
			).toNumber(),
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
					apr: compactRatioFormatter(seniorApr.toNumber()),
				},
			},
		});
	};

	const calculateTwoTrancheAprs = ({ totalInterest, totalPrincipal, timeToMaturity }, values) => {
		const poiSr = new Fraction(
			Big(
				values[DealFormField.TwoTranche][TrancheName.Senior][TrancheFormField.PercentageOfInterest]
			).toNumber(),
			100
		);
		const popSr = new Fraction(
			Big(
				values[DealFormField.TwoTranche][TrancheName.Senior][TrancheFormField.PercentageOfPrincipal]
			).toNumber(),
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
		const juniorApr = twoTrancheJuniorAPR({
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
					apr: compactRatioFormatter(seniorApr.toNumber()),
				},
				Junior: {
					apr: compactRatioFormatter(juniorApr.toNumber()),
				},
			},
		});
	};

	const calculateThreeTrancheAprs = ({ totalInterest, totalPrincipal, timeToMaturity }, values) => {
		const poiMez = new Fraction(
			Big(
				values[DealFormField.ThreeTranche][TrancheName.Mezzanine][
					TrancheFormField.PercentageOfInterest
				]
			).toNumber(),
			100
		);
		const popMez = new Fraction(
			Big(
				values[DealFormField.ThreeTranche][TrancheName.Mezzanine][
					TrancheFormField.PercentageOfPrincipal
				]
			).toNumber(),
			100
		);
		const poiSr = new Fraction(
			Big(
				values[DealFormField.ThreeTranche][TrancheName.Senior][
					TrancheFormField.PercentageOfInterest
				]
			).toNumber(),
			100
		);
		const popSr = new Fraction(
			Big(
				values[DealFormField.ThreeTranche][TrancheName.Senior][
					TrancheFormField.PercentageOfPrincipal
				]
			).toNumber(),
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
					apr: compactRatioFormatter(seniorApr.toNumber()),
				},
				Mezzanine: {
					apr: compactRatioFormatter(mezApr.toNumber()),
				},
				Junior: {
					apr: compactRatioFormatter(juniorApr.toNumber()),
				},
			},
		});
	};

	const onNextStep = async (shouldValidateFields: boolean, nextStep: number) => {
		if (shouldValidateFields) {
			await form
				.validateFields(Object.values(DealFormValidationField))
				.then(() => setCurrentStep(nextStep));
			return;
		}

		setCurrentStep(nextStep);
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
