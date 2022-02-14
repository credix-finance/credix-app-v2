import React from "react";
import { Pagination as AntdPagination } from "antd";
import { PaginationProps as AntPaginationProps } from "antd/lib/pagination";
import { PageItem } from "@components/PageItem";

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
			itemRender={(page, type, originalElement) => (
				<PageItem page={page} type={type} originalElement={originalElement} />
			)}
			{...props}
		/>
	);
};
