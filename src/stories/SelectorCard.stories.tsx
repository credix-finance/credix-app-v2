import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { SelectorCard } from "@components/SelectorCard";
import { Button } from "@components/Button";
import { Form, Radio } from "antd";
import { FormItem } from "@components/FormItem";
import { AmortizationRepaymentSchedule } from "@components/AmortizationRepaymentSchedule";
import { BulletLoanRepaymentSchedule } from "@components/BulletLoanRepaymentSchedule";
import { TrancheOption } from "@components/TrancheOption";

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
		<Form layout="vertical" initialValues={{ repaymentType: "amortization" }}>
			<FormItem name="repaymentType">
				<Radio.Group>
					<div className="space-y-4">
						<SelectorCard
							content={<div>This content is only visible when this option is selected</div>}
							value="amortization"
							title="Amortization loan"
							subtitle="Pay off a debt over time in equal installments"
							checked={true}
						/>
						<SelectorCard
							content={null}
							value="bullet"
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
		repaymentPeriod={timeToMaturity}
	/>
);

const bullet = () => (
	<BulletLoanRepaymentSchedule
		principal={principal}
		financingFee={financingFee}
		repaymentPeriod={timeToMaturity}
	/>
);

export const Amortization = Template.bind({});
Amortization.decorators = [
	() => (
		<Form layout="vertical" initialValues={{ repaymentType: "amortization" }}>
			<FormItem name="repaymentType">
				<Radio.Group>
					<div className="space-y-4">
						<SelectorCard
							content={amortization}
							value="amortization"
							title="Amortization loan"
							subtitle="Pay off a debt over time in equal installments"
							checked={true}
						/>
						<SelectorCard
							content={bullet}
							value="bullet"
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
		<Form layout="vertical" initialValues={{ repaymentType: "bullet" }}>
			<FormItem name="repaymentType">
				<Radio.Group>
					<div className="space-y-4">
						<SelectorCard
							content={amortization}
							value="amortization"
							title="Amortization loan"
							subtitle="Pay off a debt over time in equal installments"
						/>
						<SelectorCard
							content={bullet}
							value="bullet"
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
Tranches.decorators = [
	() => (
		<Form layout="vertical" initialValues={{ repaymentType: "oneTranche" }}>
			<FormItem name="repaymentType">
				<Radio.Group>
					<div className="space-y-8">
						<SelectorCard
							content={
								<TrancheOption
									trancheData={[
										{
											name: "Senior",
											expectedApy: 0.1,
											value: 1,
										},
										{
											name: "Mezzanine",
											expectedApy: null,
											value: null,
										},
										{
											name: "Junior",
											expectedApy: null,
											value: null,
										},
									]}
								/>
							}
							value="oneTranche"
							title="One tranche structure"
							checked={true}
						/>
						<SelectorCard
							content={
								<TrancheOption
									trancheData={[
										{
											name: "Senior",
											expectedApy: 0.1,
											value: 0.8,
										},
										{
											name: "Mezzanine",
											expectedApy: null,
											value: null,
										},
										{
											name: "Junior",
											expectedApy: 0.23,
											value: 0.2,
										},
									]}
								/>
							}
							value="twoTranche"
							title="Two tranche structure"
							showContent={true}
							action={<Button type="text">Edit</Button>}
						/>
						<SelectorCard
							content={
								<TrancheOption
									trancheData={[
										{
											name: "Senior",
											expectedApy: 0.1,
											value: 0.75,
										},
										{
											name: "Mezzanine",
											expectedApy: 0.17,
											value: 0.2,
										},
										{
											name: "Junior",
											expectedApy: 0.34,
											value: 0.05,
										},
									]}
								/>
							}
							value="threeTranche"
							title="Three tranche structure"
							showContent={true}
							action={<Button type="text">Edit</Button>}
						/>
					</div>
				</Radio.Group>
			</FormItem>
		</Form>
	),
];
