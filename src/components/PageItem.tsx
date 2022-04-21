import React from "react";
import { Icon, IconDimension } from "./Icon";

export enum PageItemType {
	PREV = "prev",
	NEXT = "next",
	PAGE = "page",
	JUMP_PREV = "jump-prev",
	JUMP_NEXT = "jump-next",
}

interface PageItemProps {
	page: number;
	type: PageItemType;
	originalElement: React.ReactNode;
}

export const PageItem = ({ page, type, originalElement }: PageItemProps) => {
	switch (type) {
		case PageItemType.PREV:
			return React.cloneElement(
				originalElement as React.ReactElement,
				{
					className:
						"ant-pagination-item-link border-none bg-transparent w-[39px] h-[36px] grid place-content-center",
				},
				<Icon name="chevron-left" size={IconDimension.SMALL} />
			);
		case PageItemType.PAGE:
			return React.cloneElement(
				originalElement as React.ReactElement,
				{
					className:
						"ant-pagination-item-link border-none bg-white w-[39px] h-[36px] font-mono grid place-content-center text-lg font-medium hover:text-neutral-100",
				},
				<span>{page}</span>
			);
		case PageItemType.NEXT:
			return React.cloneElement(
				originalElement as React.ReactElement,
				{
					className:
						"ant-pagination-item-link border-none bg-transparent w-[39px] h-[36px] grid place-content-center",
				},
				<Icon name="chevron-right" size={IconDimension.SMALL} />
			);
		case PageItemType.JUMP_NEXT:
		case PageItemType.JUMP_PREV:
			return React.cloneElement(
				originalElement as React.ReactElement,
				{
					className:
						"ant-pagination-item-link text-neutral-100 border-none bg-transparent w-[39px] h-[36px] grid place-content-center",
				},
				<Icon name="ellipsis" className="w-6 h-5" />
			);
		default:
			console.log(type);
			return null;
	}
};
