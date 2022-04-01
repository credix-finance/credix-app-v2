import { Ratio } from "@credix/credix-client";
import { clamp, ratioFormatter } from "@utils/format.utils";
import { FunctionComponent } from "react";

interface DealAspectProps {
	title: string;
	value: string;
	ratio?: Ratio;
	showRatio?: boolean;
}

export const DealAspect: FunctionComponent<DealAspectProps> = ({
	title,
	value,
	ratio,
	showRatio = true,
}) => {
	const hasRatio = ratio !== undefined;
	return (
		<div
			className={`${
				hasRatio ? "p-3" : "p-6"
			} border border-solid border-neutral-60 relative w-full`}
		>
			{hasRatio && (
				<div
					className="absolute top-0 left-0 h-1 bg-neutral-60"
					style={{ width: `${clamp(ratio.apply(1).toNumber() * 100, 0, 100)}%` }}
				></div>
			)}
			<div className="uppercase">{title}</div>
			<div className="flex justify-between items-center pt-2">
				<div className="text-2xl font-bold">{value}</div>
				<div className="font-bold">
					{hasRatio && showRatio && ratioFormatter.format(ratio.apply(1).toNumber())}
				</div>
			</div>
		</div>
	);
};
