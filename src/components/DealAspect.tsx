import React, { FunctionComponent, ReactNode } from "react";
import { Fraction } from "@credix/credix-client";
import { clamp } from "@utils/format.utils";
import { Icon, IconDimension, IconName } from "./Icon";

interface DealAspectProps {
	title: string;
	value: ReactNode;
	ratio?: Fraction;
	icon?: IconName;
}

export const DealAspect: FunctionComponent<DealAspectProps> = ({ title, value, ratio, icon }) => {
	const hasRatio = ratio !== undefined;
	return (
		<div>
			<div className="p-6 border border-solid border-neutral-40 relative w-full h-full">
				<div className="flex space-x-2">
					{icon && <Icon name={icon} size={IconDimension.MIDDLE} />}
					<div className="font-medium text-base">{title}</div>
				</div>
				<div className="text-2xl font-bold pt-2">{value}</div>
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
