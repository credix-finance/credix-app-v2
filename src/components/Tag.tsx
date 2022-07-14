import React from "react";

type TagColors = "green" | "orange" | "yellow" | "lightGray" | "midGray";
export interface TagProps {
	color: TagColors;
	children?: React.ReactNode;
}

const tagColorStyles = {
	green: "bg-credix-green",
	orange: "bg-credix-orange",
	yellow: "bg-credix-yellow",
	lightGray: "bg-credix-gray-light text-credix-gray-dark",
	midGray: "bg-credix-gray-mid text-credix-gray-dark",
};

export const Tag = ({ children, color }: TagProps) => {
	return (
		<div
			data-cy="tag"
			className={`text-sm font-semibold inline-block px-4 py-2 rounded-full h-max whitespace-nowrap ${tagColorStyles[color]}`}
		>
			{children}
		</div>
	);
};
