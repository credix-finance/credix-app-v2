import { FormInstance } from "antd";
import { FunctionComponent } from "react";
import { useIntl } from "react-intl";

interface AddMaxButtonSuffixProps {
	form: FormInstance;
	amount: number;
}

export const AddMaxButtonSuffix: FunctionComponent<AddMaxButtonSuffixProps> = ({
	form,
	amount,
}) => {
	const intl = useIntl();

	const onAddMax = () => {
		form.setFieldsValue({
			amount: amount,
		});
	};

	return (
		<div onClick={onAddMax} className="pr-5 hover:cursor-pointer font-medium hover:font-semibold">
			{intl.formatMessage({
				defaultMessage: "MAX",
				description: "Add max button suffix: label",
			})}
		</div>
	);
};
