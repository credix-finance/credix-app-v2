import { FunctionComponent } from "react";
import { defineMessages, useIntl } from "react-intl";
import { classNames } from "@utils/format.utils";
import { Form, FormInstance, Radio } from "antd";
import { FormItem } from "./FormItem";
import { Button } from "./Button";
import { Icon, IconDimension } from "./Icon";
import { defaultTranches } from "@consts";
import { TrancheSelectionOption } from "./TrancheSelectionOption";

const INPUT_NUMBER_STEP = "0.1";

interface DealTranchesStepProps {
	className?: string;
	form: FormInstance;
	setCurrentStep: (step: number) => void;
}

export const DealTranchesStep: FunctionComponent<DealTranchesStepProps> = ({
	className,
	form,
	setCurrentStep,
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
					data-cy="deal-form-tranches-step-next-button"
				>
					{intl.formatMessage(MESSAGES.review)}
				</Button>
			</div>
		</div>
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
});
