import { FunctionComponent, useState } from "react";
import { defineMessages, useIntl } from "react-intl";
import { classNames } from "@utils/format.utils";
import { Form, FormInstance, Radio } from "antd";
import { FormItem } from "./FormItem";
import { SelectorCard } from "./SelectorCard";
import { Button } from "./Button";
import { Icon, IconDimension } from "./Icon";
import { DefaultTranche, defaultTranches } from "@consts";
import { TrancheOption } from "./TrancheOption";
import { Drawer } from "./Drawer";
import { Switch } from "./Switch";
import { Input } from "./Input";

const INPUT_NUMBER_STEP = "0.1";

interface DealTranchesStepProps {
	className?: string;
	form: FormInstance;
	setCurrentStep: (step: number) => void;
	onCloseTrancheSettings: () => void;
	onSaveTrancheSettings: () => void;
}

export const DealTranchesStep: FunctionComponent<DealTranchesStepProps> = ({
	className,
	form,
	setCurrentStep,
	onCloseTrancheSettings,
	onSaveTrancheSettings,
}) => {
	const selectedTranche = Form.useWatch("trancheStructure", form);
	const intl = useIntl();
	className = classNames([className, "space-y-8"]);

	return (
		<div className={className}>
			<div>{intl.formatMessage(MESSAGES.detailsTitle)}</div>
			<FormItem name="trancheStructure">
				<Radio.Group>
					<div className="space-y-8">
						{defaultTranches.map((tranche, index) => (
							<TrancheSelectionOption
								key={tranche.title}
								tranche={tranche}
								editable={index !== 0}
								form={form}
								checked={selectedTranche === tranche.value}
								onCloseTrancheSettings={onCloseTrancheSettings}
								onSaveTrancheSettings={onSaveTrancheSettings}
							/>
						))}
					</div>
				</Radio.Group>
			</FormItem>
			<div className="w-full h-[1px] mt-10  bg-neutral-105"></div>
			<div className="flex space-x-6">
				<Button type="default" onClick={() => setCurrentStep(0)}>
					{intl.formatMessage(MESSAGES.back)}
				</Button>
				<Button
					icon={<Icon name="eye" size={IconDimension.MIDDLE} />}
					onClick={() => setCurrentStep(2)}
				>
					{intl.formatMessage(MESSAGES.review)}
				</Button>
			</div>
		</div>
	);
};

const TrancheSelectionOption: FunctionComponent<{
	tranche: DefaultTranche;
	editable: boolean;
	form: FormInstance;
	checked: boolean;
	onCloseTrancheSettings: () => void;
	onSaveTrancheSettings: () => void;
}> = ({ tranche, editable, form, checked, onCloseTrancheSettings, onSaveTrancheSettings }) => {
	const intl = useIntl();
	const [visible, setVisible] = useState(false);

	const onClose = () => {
		setVisible(false);
	};

	const onSave = () => {
		onClose();
		onSaveTrancheSettings();
	};

	const onCancel = () => {
		onClose();
		onCloseTrancheSettings();
	};

	return (
		<>
			<SelectorCard
				key={tranche.value}
				content={
					<TrancheOption trancheData={tranche.trancheData} trancheStructure={tranche.value} />
				}
				value={tranche.value}
				title={tranche.title}
				checked={checked}
				showContent={true}
				action={
					editable && (
						<Button type="text" onClick={() => setVisible(true)}>
							{intl.formatMessage(MESSAGES.edit)}
						</Button>
					)
				}
				isInteractive={true}
				onSelectCard={() => {
					form.setFieldsValue({
						trancheStructure: tranche.value,
					});
				}}
			/>
			<Drawer
				onClose={onClose}
				onSave={onSave}
				onCancel={onCancel}
				visible={visible}
				title={intl.formatMessage(MESSAGES.editTrancheTitle)}
				titleIcon="adjust"
			>
				<div className="space-y-12">
					{tranche.trancheData.map((t) => {
						return (
							t.percentageOfPrincipal && (
								<div key={t.name} className="space-y-6">
									<div className="uppercase text-2xl font-bold">
										{intl.formatMessage(MESSAGES.trancheName, {
											name: t.name,
										})}
									</div>
									{
										<div className={`flex gap-x-6 `}>
											<div>
												<Input
													name={[tranche.value, t.name, "percentageOfPrincipal"]}
													className="bg-credix-primary"
													labelClassName="flex-col items-start"
													label={intl.formatMessage(MESSAGES.percentageOfPrincipalInputLabel)}
													placeholder={intl.formatMessage(
														MESSAGES.percentageOfPrincipalInputPlaceholder
													)}
													type="number"
													required={true}
													step={INPUT_NUMBER_STEP}
													rules={[
														{
															required: true,
															message: intl.formatMessage(
																MESSAGES.percentageOfPrincipalRequiredValidation
															),
														},
													]}
												/>
											</div>
											<div>
												<Input
													name={[tranche.value, t.name, "percentageOfInterest"]}
													className="bg-credix-primary"
													labelClassName="flex-col items-start"
													label={intl.formatMessage(MESSAGES.percentageOfInterestInputLabel)}
													placeholder={intl.formatMessage(
														MESSAGES.percentageOfInterestInputPlaceholder
													)}
													type="number"
													step={INPUT_NUMBER_STEP}
													required={true}
													rules={[
														{
															required: true,
															message: intl.formatMessage(
																MESSAGES.percentageOfInterestRequiredValidation
															),
														},
													]}
												/>
											</div>
											<div>
												<Input
													name={[tranche.value, t.name, "apr"]}
													className="bg-credix-primary"
													labelClassName="flex-col items-start"
													label={intl.formatMessage(MESSAGES.aprInputLabel)}
													placeholder={intl.formatMessage(MESSAGES.aprInputPlaceholder)}
													type="number"
													step={INPUT_NUMBER_STEP}
													required={true}
													rules={[
														{
															required: true,
															message: intl.formatMessage(MESSAGES.aprRequiredValidation),
														},
													]}
												/>
											</div>
										</div>
									}
									{t.earlyWithdrawalInterest !== undefined && (
										<div className="flex justify-between">
											<Switch
												name={[tranche.value, t.name, "earlyWithdrawalInterest"]}
												label={intl.formatMessage(MESSAGES.withdrawInterest)}
											/>
											<Switch
												name={[tranche.value, t.name, "earlyWithdrawalPrincipal"]}
												label={intl.formatMessage(MESSAGES.withdrawPrincipal)}
											/>
										</div>
									)}
								</div>
							)
						);
					})}
				</div>
			</Drawer>
		</>
	);
};

const MESSAGES = defineMessages({
	detailsTitle: {
		defaultMessage: "Please fill in all information needed to submit a new deal.",
		description: "New deal: details form title",
	},
	back: {
		defaultMessage: "Back",
		description: "Deal form: back button",
	},
	review: {
		defaultMessage: "Review Deal",
		description: "Deal form: review button",
	},
	edit: {
		defaultMessage: "Edit",
		description: "Tranche option: edit button",
	},
	editTrancheTitle: {
		defaultMessage: "Edit tranche structure",
		description: "Tranche option: edit tranche structure title",
	},
	trancheName: {
		defaultMessage: "{name} tranche",
		description: "Tranche option: tranche name",
	},
	withdrawInterest: {
		defaultMessage: "Interest withdrawal",
		description: "Tranche option: withdraw interest",
	},
	withdrawPrincipal: {
		defaultMessage: "Principal withdrawal",
		description: "Tranche option: withdraw principal",
	},
	percentageOfPrincipalInputLabel: {
		defaultMessage: "Principal",
		description: "Tranche option: principal input label",
	},
	percentageOfPrincipalInputPlaceholder: {
		defaultMessage: "%",
		description: "Tranche option: principal input placeholder",
	},
	percentageOfPrincipalRequiredValidation: {
		defaultMessage: "'principal' is required",
		description: "Tranche option: principal required validation",
	},
	percentageOfInterestInputLabel: {
		defaultMessage: "Interest",
		description: "Tranche option: interest input label",
	},
	percentageOfInterestInputPlaceholder: {
		defaultMessage: "%",
		description: "Tranche option: interest input placeholder",
	},
	percentageOfInterestRequiredValidation: {
		defaultMessage: "'interest' is required",
		description: "Tranche option: interest required validation",
	},
	aprInputLabel: {
		defaultMessage: "Apr",
		description: "Tranche option: apr input label",
	},
	aprInputPlaceholder: {
		defaultMessage: "%",
		description: "Tranche option: apr input placeholder",
	},
	aprRequiredValidation: {
		defaultMessage: "'apr' is required",
		description: "Tranche option: apr required validation",
	},
});
