import React, { FunctionComponent } from "react";
import { Fraction } from "@credix/credix-client";
import { clamp } from "@utils/format.utils";
import { Icon, IconDimension, IconName } from "./Icon";

interface DealAspectProps {
	title: string;
	value: string;
	ratio?: Fraction;
	emphasizeValue?: boolean;
	icon?: IconName;
	dataCy?: string;
}

export const DealAspect: FunctionComponent<DealAspectProps> = ({
	title,
	value,
	ratio,
	emphasizeValue = false,
	icon,
	dataCy,
}) => {
	const hasRatio = ratio !== undefined && !ratio.equals(new Fraction(0, 1));
	return (
		<div>
			<div className="p-6 border border-solid border-neutral-40 relative w-full h-full">
				<div className="flex space-x-2">
					{icon && <Icon name={icon} size={IconDimension.MIDDLE} />}
					<div className="font-medium text-base">{title}</div>
				</div>
				<div
					className={`${emphasizeValue ? "text-5xl" : "text-2xl"} font-bold pt-2`}
					data-cy={dataCy}
				>
					{value}
				</div>
			</div>
			{hasRatio && (
				<div className="relative h-2 bg-neutral-90 w-full">
					<div
						className="absolute h-2 bg-neutral-20"
						style={{ width: `${clamp(ratio.apply(100).toNumber(), 0, 100)}%` }}
					></div>
				</div>
			)}
		</div>
	);
};
