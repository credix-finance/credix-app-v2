import React from "react";

type TagTypes = "active" | "pending" | "inactive" | "ended";
interface TagProps {
	type: TagTypes;
	children?: React.ReactNode;
}

const tagTypeStyles = {
	active: `bg-neutral-60 border-neutral-60 text-credix-primary`,
	inactive: `bg-neutral-10 border-neutral-10`,
	pending: `bg-neutral-40 border-neutral-40 text-credix-primary`,
	ended: `bg-credix-primary border-solid border-darker color-darker`,
};

export const Tag = ({ children, type }: TagProps) => {
	return (
		<div
			className={`py-[2px] border rounded-full min-w-[88px] font-semibold w-min flex justify-center ${tagTypeStyles[type]}`}
		>
			{children}
		</div>
	);
};
