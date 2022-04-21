import React from "react";
import { Pagination as AntdPagination } from "antd";
import { PaginationProps as AntPaginationProps } from "antd/lib/pagination";
import { PageItem, PageItemType } from "@components/PageItem";

interface PaginationProps {
	total?: AntPaginationProps["total"];
	pageSize?: AntPaginationProps["pageSize"];
}

export const Pagination = ({ total, pageSize, ...props }: PaginationProps) => {
	return (
		<AntdPagination
			className="ant-table-pagination"
			total={total}
			pageSize={pageSize}
			itemRender={(page, type, originalElement) => {
				return (
					<PageItem page={page} type={type as PageItemType} originalElement={originalElement} />
				);
			}}
			{...props}
		/>
	);
};
