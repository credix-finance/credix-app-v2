import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { SelectorCard } from "@components/SelectorCard";
import { Button } from "@components/Button";
import { Form, Radio } from "antd";
import { FormItem } from "@components/FormItem";
import { AmortizationRepaymentSchedule } from "@components/AmortizationRepaymentSchedule";

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

export const Amortization = Template.bind({});
Amortization.decorators = [
	() => (
		<Form layout="vertical" initialValues={{ repaymentType: "amortization" }}>
			<FormItem name="repaymentType">
				<Radio.Group>
					<div className="space-y-4">
						<SelectorCard
							content={<AmortizationRepaymentSchedule />}
							value="amortization"
							title="Amortization loan"
							subtitle="Pay off a debt over time in equal installments"
							checked={true}
						/>
						<SelectorCard
							content={<BulletLoanRepaymentSchedule />}
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
