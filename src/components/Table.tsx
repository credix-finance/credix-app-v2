/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Table as AntdTable } from "antd";
import { TableProps as AntdTableProps } from "antd/lib/table";
import { PageItem } from "@components/PageItem";

interface TableProps {
	/**
	 * The data which will fill the table
	 */
	dataSource?: AntdTableProps<any>["dataSource"];
	/**
	 * Table columns
	 */
	columns?: AntdTableProps<any>["columns"];
}

export const Table = (props: TableProps) => {
	return (
		<AntdTable
			pagination={{
				hideOnSinglePage: true,
				pageSize: 10,
				itemRender: (page, type, originalElement) => (
					<PageItem page={page} type={type} originalElement={originalElement} />
				),
			}}
			{...props}
		/>
	);
};
