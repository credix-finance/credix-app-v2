import { useUserBaseBalance } from "@hooks/useUserBaseBalance";
import { FormInstance } from "antd";
import { FunctionComponent } from "react";
import { useIntl } from "react-intl";

interface AddMaxButtonSuffixProps {
	form: FormInstance;
}

export const AddMaxButtonSuffix: FunctionComponent<AddMaxButtonSuffixProps> = ({ form }) => {
	const intl = useIntl();
	const userBaseBalance = useUserBaseBalance();

	const onAddMax = () => {
		form.setFieldsValue({
			amount: userBaseBalance.uiAmountString,
		});
	};

	return (
		<div
			onClick={onAddMax}
			className="md:pr-5 hover:cursor-pointer font-medium hover:font-semibold"
		>
			{intl.formatMessage({
				defaultMessage: "MAX",
				description: "Add max button suffix: label",
			})}
		</div>
	);
};
