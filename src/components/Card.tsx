import React from "react";

export enum CardOffset {
	SMALL = "small",
	MIDDLE = "middle",
	LARGE = "large",
}
interface CardProps {
	topTitle?: string;
	title: string;
	offset?: CardOffset;
	children: React.ReactNode;
}

export const Card = ({ topTitle, title, offset = CardOffset.MIDDLE, children }: CardProps) => {
	const offsetValues = {
		small: "-ml-9",
		middle: "-ml-12",
		large: "-ml-14",
	};

	return (
		<div className="md:col-span-3 border border-solid rounded-[1px] border-darker w-full p-7 pt-16">
			<div className={`bg-credix-primary ${offsetValues[offset]} py-[18.5px]`}>
				<div className="text-xs font-normal capitalize">{topTitle}</div>
				<div className="font-sans font-semibold text-[32px] capitalize">{title}</div>
			</div>
			<div className="text-base">{children}</div>
		</div>
	);
};
