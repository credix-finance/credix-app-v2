import React, { FunctionComponent } from "react";
import { Steps } from "antd";
import { Icon } from "./Icon";

const { Step: Step } = Steps;

interface StepperProps {
	current: number;
	steps: string[];
}

export const Stepper: FunctionComponent<StepperProps> = ({ current, steps }) => {
	const stepTitle = (current: number, index: number, title: string) => {
		return (
			<div className="flex items-center">
				{current > index ? <Icon name="check-square" className="mr-2 w-5 h-5" /> : `${index + 1}.`}
				{title}
			</div>
		);
	};

	return (
		<Steps current={current} type="navigation" progressDot={() => null} labelPlacement="horizontal">
			{steps.map((step, index) => (
				<Step key={step} title={stepTitle(current, index, step)} />
			))}
		</Steps>
	);
};
