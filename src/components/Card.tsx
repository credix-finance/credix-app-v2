import React from "react";

interface CardProps {
	topTitle?: string;
	title: string;
	offset?: "small" | "middle" | "large";
	children: React.ReactNode;
}

export const Card = ({ topTitle, title, offset = "middle", children }: CardProps) => {
	const offsetValues = {
		small: "-ml-9",
		middle: "-ml-12",
		large: "-ml-14",
	};

	return (
		<div className="md:col-span-3 border border-solid rounded-[1px] border-darker w-full p-7 pt-16 bg-transparent">
			<div className={`bg-transparent ${offsetValues[offset]} py-[18.5px] w-max relative`}>
				<div className="left-4 absolute top-1 w-3 h-20 z-10 bg-credix-primary"></div>
				<div className="text-xs font-normal capitalize relative z-20">{topTitle}</div>
				<div className="font-sans font-semibold text-[32px] capitalize relative z-20">{title}</div>
			</div>
			<div className="text-base">{children}</div>
		</div>
	);
};
