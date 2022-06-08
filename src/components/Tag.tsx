import React from "react";

type TagColors = "green" | "orange" | "yellow" | "lightGray" | "midGray";
export interface TagProps {
	type: TagColors;
	children?: React.ReactNode;
}

const tagTypeStyles = {
	green: "bg-credix-green",
	orange: "bg-credix-orange",
	yellow: "bg-credix-yellow",
	lightGray: "bg-credix-gray-light text-credix-gray-dark",
	midGray: "bg-credix-gray-mid text-credix-gray-dark",
};

export const Tag = ({ children, type }: TagProps) => {
	return (
		<div
			className={`text-sm font-semibold inline-block px-4 py-2 rounded-full ${tagTypeStyles[type]}`}
		>
			{children}
		</div>
	);
};
