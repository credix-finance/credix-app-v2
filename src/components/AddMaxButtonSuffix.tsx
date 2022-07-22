import { FormInstance } from "antd";
import Big, { BigSource } from "big.js";
import { FunctionComponent } from "react";
import { useIntl } from "react-intl";

interface AddMaxButtonSuffixProps {
	form: FormInstance;
	amount: BigSource;
}

export const AddMaxButtonSuffix: FunctionComponent<AddMaxButtonSuffixProps> = ({
	form,
	amount,
}) => {
	const intl = useIntl();

	const onAddMax = () => {
		form.setFieldsValue({
			amount: Big(amount).toString(),
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
