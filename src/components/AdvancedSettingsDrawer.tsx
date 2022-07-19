import { DealAdvancedSettings, defaultAdvancedSettings } from "@consts";
import { classNames } from "@utils/format.utils";
import { Form } from "antd";
import { FunctionComponent, useState } from "react";
import { defineMessages, useIntl } from "react-intl";
import { Drawer } from "./Drawer";
import { Switch } from "./Switch";
import { Button } from "./Button";
import { Icon, IconDimension } from "./Icon";

const advancedSettingsFields = [
	"slashInterestToPrincipal",
	"slashPrincipalToInterest",
	"trueWaterfall",
];

interface AdvancedSettingsDrawerProps {
	className?: string;
}

export const AdvancedSettingsDrawer: FunctionComponent<AdvancedSettingsDrawerProps> = ({
	className,
}) => {
	const form = Form.useFormInstance();
	const intl = useIntl();
	const [visible, setVisible] = useState(false);
	const [advancedSettings, setAdvancedSettings] =
		useState<Partial<DealAdvancedSettings>>(defaultAdvancedSettings);

	const onClose = () => setVisible(false);

	const onCancel = () => {
		onClose();
		form.setFieldsValue(advancedSettings);
		setAdvancedSettings({});
	};

	const onSave = () => {
		onClose();
		const updatedAdvancedSettings = form.getFieldsValue(advancedSettingsFields);
		// Update the advancedSettings "cache"
		setAdvancedSettings(updatedAdvancedSettings);
	};

	const onOpen = () => {
		setVisible(true);
		const advancedSettings = form.getFieldsValue(advancedSettingsFields);
		// Update the advancedSettings "cache"
		setAdvancedSettings(advancedSettings);
	};

	className = classNames([className]);
	return (
		<div className={className}>
			<Button
				type="text"
				icon={<Icon name="adjust" size={IconDimension.MIDDLE} />}
				onClick={onOpen}
			>
				{intl.formatMessage(MESSAGES.advancedSettingsButtonText)}
			</Button>
			<Drawer
				onClose={onCancel}
				onSave={onSave}
				onCancel={onCancel}
				visible={visible}
				title={intl.formatMessage(MESSAGES.advancedSettingsTitle)}
				titleIcon="adjust"
			>
				<div>
					<Switch name="trueWaterfall" label={intl.formatMessage(MESSAGES.trueWaterfall)} />
					<Switch
						name="slashInterestToPrincipal"
						label={intl.formatMessage(MESSAGES.slashInterestToPrincipal)}
					/>
					<Switch
						name="slashPrincipalToInterest"
						label={intl.formatMessage(MESSAGES.slashPrincipalToInterest)}
					/>
				</div>
			</Drawer>
		</div>
	);
};

const MESSAGES = defineMessages({
	advancedSettingsTitle: {
		defaultMessage: "Advanced settings",
		description: "Deal form: advanced settings title",
	},
	advancedSettingsButtonText: {
		defaultMessage: "Advanced settings",
		description: "Deal form: advanced settings button text",
	},
	slashPrincipalToInterest: {
		defaultMessage: "Slash principal to interest",
		description: "Deal form: slash principal to interest switch label",
	},
	slashInterestToPrincipal: {
		defaultMessage: "Slash interest to principal",
		description: "Deal form: slash interest to principal switch label",
	},
	trueWaterfall: {
		defaultMessage: "True waterfall",
		description: "Deal form: true waterfall switch label",
	},
});
