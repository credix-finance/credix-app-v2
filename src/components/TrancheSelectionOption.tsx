import React, { FunctionComponent, ReactNode, useState } from "react";
import { defineMessages, useIntl } from "react-intl";
import { FormInstance } from "antd";
import { SelectorCard } from "./SelectorCard";
import { Button } from "./Button";
import { DealTrancheSettings, DefaultTranche, defaultTrancheSettings } from "@consts";
import { TrancheOption } from "./TrancheOption";
import { Drawer } from "./Drawer";
import { Switch } from "./Switch";
import { trancheSettingsFields } from "./DealForm";
import { Input } from "./Input";

export const TrancheSelectionOption: FunctionComponent<{
	tranche: DefaultTranche;
	editable: boolean;
	form: FormInstance;
	checked: boolean;
	action?: ReactNode;
	subtitle?: string;
}> = ({ tranche, editable, form, checked, action, subtitle }) => {
	const intl = useIntl();
	const [visible, setVisible] = useState(false);
	const [trancheSettings, setTrancheSettings] =
		useState<DealTrancheSettings>(defaultTrancheSettings);
	const formTranche = form.getFieldValue(tranche.value);

	const onClose = () => {
		setVisible(false);
	};

	const onOpen = () => {
		// save the current form values to the trancheSettings "cache"
		const trancheSettings = form.getFieldsValue(trancheSettingsFields);
		setTrancheSettings(trancheSettings);
		setVisible(true);
	};

	const onSave = () => {
		const updatedTrancheSettings = form.getFieldsValue(trancheSettingsFields);
		// Update the TrancheSettings "cache"
		setTrancheSettings(updatedTrancheSettings);
		onClose();
	};

	const onCancel = () => {
		form.setFieldsValue(trancheSettings);
		onClose();
	};

	return (
		<>
			<SelectorCard
				key={tranche.value}
				content={<TrancheOption trancheStructure={formTranche} />}
				value={tranche.value}
				title={tranche.title}
				subtitle={subtitle}
				checked={checked}
				showContent={true}
				action={
					<div className="flex items-center space-x-4">
						{action}
						{editable && (
							<Button type="text" onClick={onOpen}>
								{intl.formatMessage(MESSAGES.edit)}
							</Button>
						)}
					</div>
				}
				isInteractive={true}
			/>
			<Drawer
				onClose={onCancel}
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
									{t.editable && (
										<div className="flex gap-x-6">
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
									)}
									<div>
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
								</div>
							)
						);
					})}
				</div>
			</Drawer>
		</>
	);
};

export const MESSAGES = defineMessages({
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
