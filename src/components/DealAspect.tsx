import { clamp, ratioFormatter } from "@utils/format.utils";
import { FunctionComponent } from "react";

interface DealAspectProps {
	title: string;
	value: string;
	ratio?: number;
}

export const DealAspect: FunctionComponent<DealAspectProps> = ({ title, value, ratio }) => {
	return (
		<div
			className={`${
				ratio ? "p-3" : "p-6"
			} border border-solid border-neutral-60 relative w-full md:w-52`}
		>
			{ratio && (
				<div
					className="absolute top-0 left-0 h-1 bg-neutral-60"
					style={{ width: `${clamp(ratio * 100, 0, 100)}%` }}
				></div>
			)}
			<div className="uppercase">{title}</div>
			<div className="flex justify-between items-center pt-2">
				<div className="text-2xl font-bold">{value}</div>
				<div className="font-bold">{ratio && ratioFormatter.format(ratio)}</div>
			</div>
		</div>
	);
};
