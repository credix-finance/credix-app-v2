import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { SelectorCard } from "@components/SelectorCard";
import { Button } from "@components/Button";
import { Form, Radio } from "antd";
import { FormItem } from "@components/FormItem";
import { AmortizationRepaymentSchedule } from "@components/AmortizationRepaymentSchedule";
import { BulletLoanRepaymentSchedule } from "@components/BulletLoanRepaymentSchedule";
import { TrancheOption } from "@components/TrancheOption";
import { RepaymentScheduleType } from "@credix_types/repaymentschedule.types";
import { defaultTrancheSettings } from "@consts";
import { TrancheFormValue, TrancheTitle } from "@credix_types/tranche.types";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	title: "Components/SelectorCard",
	component: SelectorCard,
} as ComponentMeta<typeof SelectorCard>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof SelectorCard> = (args) => <SelectorCard {...args} />;
const defaultDecorators = [
	(Story) => (
		<Form layout="vertical">
			<Story />
		</Form>
	),
];

export const Default = Template.bind({});
Default.decorators = defaultDecorators;
Default.args = {
	title: "Amortization loan",
	subtitle: "Pay off a debt over time in equal installments",
	name: "repaymentType",
};

export const WithAction = Template.bind({});
Default.decorators = defaultDecorators;
WithAction.args = {
	title: "Amortization loan",
	subtitle: "Pay off a debt over time in equal installments",
	action: <Button type="text">Edit</Button>,
};

export const Selected = Template.bind({});
Selected.decorators = [
	() => (
		<Form layout="vertical" initialValues={{ repaymentType: RepaymentScheduleType.AMORTIZATION }}>
			<FormItem name="repaymentType">
				<Radio.Group>
					<div className="space-y-4">
						<SelectorCard
							content={<div>This content is only visible when this option is selected</div>}
							value={RepaymentScheduleType.AMORTIZATION}
							title="Amortization loan"
							subtitle="Pay off a debt over time in equal installments"
							checked={true}
						/>
						<SelectorCard
							content={null}
							value={RepaymentScheduleType.BULLET}
							title="Bullet loan"
							subtitle="The Principal that is borrowed is paid back in full at the end of the loan term"
						/>
					</div>
				</Radio.Group>
			</FormItem>
		</Form>
	),
];
Selected.args = {};

const principal = 1_000_000;
const financingFee = 0.15;
const timeToMaturity = 360;

const amortization = () => (
	<AmortizationRepaymentSchedule
		principal={principal}
		financingFee={financingFee}
		timeToMaturity={timeToMaturity}
	/>
);

const bullet = () => (
	<BulletLoanRepaymentSchedule
		principal={principal}
		financingFee={financingFee}
		timeToMaturity={timeToMaturity}
	/>
);

export const Amortization = Template.bind({});
Amortization.decorators = [
	() => (
		<Form layout="vertical" initialValues={{ repaymentType: RepaymentScheduleType.AMORTIZATION }}>
			<FormItem name="repaymentType">
				<Radio.Group>
					<div className="space-y-4">
						<SelectorCard
							content={amortization}
							value={RepaymentScheduleType.AMORTIZATION}
							title="Amortization loan"
							subtitle="Pay off a debt over time in equal installments"
							checked={true}
						/>
						<SelectorCard
							content={bullet}
							value={RepaymentScheduleType.BULLET}
							title="Bullet loan"
							subtitle="The Principal that is borrowed is paid back in full at the end of the loan term"
						/>
					</div>
				</Radio.Group>
			</FormItem>
		</Form>
	),
];

export const BulletLoan = Template.bind({});
BulletLoan.decorators = [
	() => (
		<Form layout="vertical" initialValues={{ repaymentType: RepaymentScheduleType.BULLET }}>
			<FormItem name="repaymentType">
				<Radio.Group>
					<div className="space-y-4">
						<SelectorCard
							content={amortization}
							value={RepaymentScheduleType.AMORTIZATION}
							title="Amortization loan"
							subtitle="Pay off a debt over time in equal installments"
						/>
						<SelectorCard
							content={bullet}
							value={RepaymentScheduleType.BULLET}
							title="Bullet loan"
							subtitle="The Principal that is borrowed is paid back in full at the end of the loan term"
							checked={true}
						/>
					</div>
				</Radio.Group>
			</FormItem>
		</Form>
	),
];

export const Tranches = Template.bind({});
console.log(defaultTrancheSettings.oneTranche);
Tranches.decorators = [
	() => (
		<Form layout="vertical" initialValues={{ trancheStructure: TrancheFormValue.OneTranche }}>
			<FormItem name="trancheStructure">
				<Radio.Group>
					<div className="space-y-8">
						<SelectorCard
							content={
								<TrancheOption seniorTrancheSettings={defaultTrancheSettings.oneTranche.Senior} />
							}
							value={TrancheFormValue.OneTranche}
							title={TrancheTitle.OneTranche}
							checked={true}
						/>
						<SelectorCard
							content={
								<TrancheOption
									juniorTrancheSettings={defaultTrancheSettings.twoTranche.Junior}
									seniorTrancheSettings={defaultTrancheSettings.twoTranche.Senior}
								/>
							}
							value={TrancheFormValue.TwoTranche}
							title={TrancheTitle.TwoTranche}
							showContent={true}
							action={<Button type="text">Edit</Button>}
						/>
						<SelectorCard
							content={
								<TrancheOption
									juniorTrancheSettings={defaultTrancheSettings.threeTranche.Junior}
									mezzanineTrancheSettings={defaultTrancheSettings.threeTranche.Mezzanine}
									seniorTrancheSettings={defaultTrancheSettings.threeTranche.Senior}
								/>
							}
							value={TrancheFormValue.ThreeTranche}
							title={TrancheTitle.ThreeTranche}
							showContent={true}
							action={<Button type="text">Edit</Button>}
						/>
					</div>
				</Radio.Group>
			</FormItem>
		</Form>
	),
];
