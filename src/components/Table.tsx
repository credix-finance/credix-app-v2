/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Table as AntdTable } from "antd";
import { TableProps as AntdTableProps } from "antd/lib/table";
import { PageItem } from "@components/PageItem";
import { ColumnType } from "antd/lib/table";
import { TableHeaderCell } from "./TableHeaderCell";
import { IconName } from "@components/Icon";

type ColumnsProps = ColumnType<any> & {
	/**
	 * Optional icon that will be displayed on the left of the column title
	 */
	icon?: IconName;
	titleClassName?: string;
};

interface TableProps {
	/**
	 * The data which will fill the table
	 */
	dataSource?: AntdTableProps<any>["dataSource"];
	/**
	 * Table columns
	 */
	columns?: ColumnsProps[];
	/**
	 * onRow provides a way to hook into click events originating from the table row.
	 * This prop also enables table hover styles
	 */
	onRow?: AntdTableProps<any>["onRow"];
}

export const Table = ({ columns, ...props }: TableProps) => {
	const [parsedColumns, setParsedColumns] = useState([]);

	useEffect(() => {
		setParsedColumns(
			columns.map((column) => {
				if (typeof column.title === "function") {
					return column;
				}

				if (column.icon) {
					const { icon, title, titleClassName } = column;
					return Object.assign({}, column, {
						title: () => (
							<TableHeaderCell label={title as string} icon={icon} className={titleClassName} />
						),
					});
				}

				return column;
			})
		);
	}, [columns]);

	return (
		<AntdTable
			className={props.onRow ? "table-hoverable" : ""}
			pagination={{
				hideOnSinglePage: true,
				pageSize: 5,
				itemRender: (page, type, originalElement) => (
					<PageItem page={page} type={type} originalElement={originalElement} />
				),
			}}
			columns={parsedColumns}
			{...props}
		/>
	);
};
