import { FunctionComponent } from "react";
import { Switch as AntSwitch } from "antd";
import { FormItem, FormItemProps } from "./FormItem";

interface SwitchProps {
	name: FormItemProps["name"];
	label: FormItemProps["label"];
}
export const Switch: FunctionComponent<SwitchProps> = ({ name, label }) => {
	return (
		<FormItem
			name={name}
			label={label}
			valuePropName="checked"
			itemClassName="switch"
			labelClassName="mb-0"
		>
			<AntSwitch></AntSwitch>
		</FormItem>
	);
};
