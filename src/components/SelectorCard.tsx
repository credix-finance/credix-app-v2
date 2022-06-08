import { FunctionComponent, ReactNode } from "react";
import { Radio } from "antd";
import { classNames } from "@utils/format.utils";

interface SelectorCardProps {
	title: string;
	subtitle?: string;
	content: ReactNode;
	action?: ReactNode;
	value: string;
	checked?: boolean;
}

export const SelectorCard: FunctionComponent<SelectorCardProps> = ({
	title,
	subtitle,
	content,
	action,
	checked,
	value,
}) => {
	const className = classNames([
		"p-6 border border-dashed border- rounded-md",
		checked && "bg-white",
	]);

	return (
		<div className={className}>
			<div className="flex justify-between items-start">
				<Radio value={value}>
					<div className="pl-2">
						<div className="font-medium text-base text-darker">{title}</div>
						{subtitle && <div className="font-normal text-sm text-neutral-60">{subtitle}</div>}
					</div>
				</Radio>
				{action}
			</div>
			{checked && content && (
				<div>
					<div className="w-full h-[1px] my-4 bg-neutral-105 bg-opacity-50"></div>
					<div className="font-normal text-base">{content}</div>
				</div>
			)}
		</div>
	);
};
