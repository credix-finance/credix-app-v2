import React from "react";
import { Icon, IconDimension } from "./Icon";

interface PageItemProps {
	page: number;
	type: "prev" | "next" | "page" | "jump-prev" | "jump-next";
	originalElement: React.ReactNode;
}

export const PageItem = ({ page, type, originalElement }: PageItemProps) => {
	switch (type) {
		case "prev":
			return React.cloneElement(
				originalElement as React.ReactElement,
				{
					className:
						"ant-pagination-item-link border-none bg-transparent w-[39px] h-8 grid place-content-center",
				},
				<Icon name="chevron-left" size={IconDimension.SMALL} />
			);
		case "page":
			return React.cloneElement(
				originalElement as React.ReactElement,
				{
					className:
						"ant-pagination-item-link border-none bg-white w-[39px] h-8 font-mono grid place-content-center text-lg font-medium hover:text-neutral-100",
				},
				<span>{page}</span>
			);
		case "next":
			return React.cloneElement(
				originalElement as React.ReactElement,
				{
					className:
						"ant-pagination-item-link border-none bg-transparent w-[39px] h-8 grid place-content-center",
				},
				<Icon name="chevron-right" size={IconDimension.SMALL} />
			);
		case "jump-prev":
		case "jump-next":
			return React.cloneElement(
				originalElement as React.ReactElement,
				{
					className:
						"ant-pagination-item-link text-neutral-100 border-none bg-transparent w-[39px] h-8 grid place-content-center",
				},
				<Icon name="ellipsis" className="w-6 h-5" />
			);
		default:
			return null;
	}
};
