import { FunctionComponent } from "react";
import { useIntl } from "react-intl";
import { classNames } from "@utils/format.utils";
import { Form, FormInstance, Radio } from "antd";
import { FormItem } from "./FormItem";
import { SelectorCard } from "./SelectorCard";
import { Button } from "./Button";
import { Icon, IconDimension } from "./Icon";
import { defaultTranches } from "@consts";
import { TrancheOption } from "./TrancheOption";

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
			<div>
				{intl.formatMessage({
					defaultMessage: "Please fill in all information needed to submit a new deal.",
					description: "New deal: details form title",
				})}
			</div>
			<FormItem name="trancheStructure">
				<Radio.Group>
					<div className="space-y-8">
						{defaultTranches.map((tranche) => (
							<SelectorCard
								key={tranche.value}
								content={<TrancheOption trancheData={tranche.trancheData} />}
								value={tranche.value}
								title={tranche.title}
								checked={selectedTranche === tranche.value}
								showContent={true}
								onSelectCard={() => {
									form.setFieldsValue({
										trancheStructure: tranche.value,
									});
								}}
							/>
						))}
					</div>
				</Radio.Group>
			</FormItem>
			<div className="w-full h-[1px] mt-10  bg-neutral-105"></div>
			<div className="flex space-x-6">
				<Button type="default" onClick={() => setCurrentStep(0)}>
					{intl.formatMessage({
						defaultMessage: "Back",
						description: "Deal form: back button",
					})}
				</Button>
				<Button
					icon={<Icon name="eye" size={IconDimension.MIDDLE} />}
					onClick={() => setCurrentStep(2)}
				>
					{intl.formatMessage({
						defaultMessage: "Review Deal",
						description: "Deal form: review button",
					})}
				</Button>
			</div>
		</div>
	);
};
