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
	showContent?: boolean;
	isInteractive?: boolean;
	className?: string;
	onSelectCard?: () => void;
}

export const SelectorCard: FunctionComponent<SelectorCardProps> = ({
	title,
	subtitle,
	content,
	action,
	checked,
	value,
	showContent,
	isInteractive,
	className,
	onSelectCard,
}) => {
	const classes = classNames([
		className,
		"p-6 border",
		isInteractive
			? "border-dashed rounded-md border-black hover:cursor-pointer"
			: "border-neutral-40",
		checked && "bg-white",
	]);

	return (
		<div className={classes} onClick={isInteractive && onSelectCard}>
			<div className="flex justify-between items-start">
				{isInteractive ? (
					<Radio value={value}>
						<div className="pl-2">
							<div className="font-medium text-base text-darker">{title}</div>
							{subtitle && <div className="font-normal text-sm text-neutral-60">{subtitle}</div>}
						</div>
					</Radio>
				) : (
					<div>
						<div className="font-medium text-base text-darker">{title}</div>
						{subtitle && <div className="font-normal text-sm text-neutral-60">{subtitle}</div>}
					</div>
				)}
				{action}
			</div>
			{(checked || showContent) && content && (
				<div>
					<div className="w-full h-[1px] my-4 bg-neutral-105 bg-opacity-50"></div>
					<div className="font-normal text-base">{content}</div>
				</div>
			)}
		</div>
	);
};
