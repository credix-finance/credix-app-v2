import { FunctionComponent, ReactNode, useRef } from "react";
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
	dataCy?: string;
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
	dataCy,
}) => {
	const radioRef = useRef(null);
	const classes = classNames([
		className,
		"p-6 border",
		isInteractive
			? "border-dashed rounded-md border-black hover:cursor-pointer"
			: "border-neutral-40",
		checked && "bg-white",
	]);

	const clickRadio = () => {
		if (radioRef.current && radioRef.current.input) {
			radioRef.current.input.click();
		}
	};

	return (
		<div className={classes} onClick={isInteractive ? clickRadio : undefined} data-cy={dataCy}>
			<div className="flex justify-between items-start">
				{isInteractive ? (
					<Radio value={value} ref={radioRef}>
						<div className="pl-2">
							<div className="font-medium text-base text-darker">{title}</div>
							{subtitle && <div className="font-normal text-sm text-neutral-60">{subtitle}</div>}
						</div>
					</Radio>
				) : (
					<div>
						<div className="font-medium text-base text-darker">{title}</div>
						{subtitle && (
							<div className="font-normal text-sm text-neutral-60 whitespace-nowrap">
								{subtitle}
							</div>
						)}
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
