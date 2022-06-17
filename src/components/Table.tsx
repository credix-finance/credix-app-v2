/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Table as AntdTable } from "antd";
import { TableProps as AntdTableProps } from "antd/lib/table";
import { PageItem } from "@components/PageItem";
import { ColumnType } from "antd/lib/table";
import { TableHeaderCell } from "./TableHeaderCell";
import { IconDimension, IconName } from "@components/Icon";

export type ColumnsProps = ColumnType<any> & {
	/**
	 * Optional icon that will be displayed on the left of the column title
	 */
	icon?: IconName;
	iconSize?: IconDimension;
	titleClassName?: string;
};

export interface TableProps {
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
	/**
	 * controls whether the table displays a loading spinner
	 */
	loading?: AntdTableProps<any>["loading"];
}

export const Table = ({ columns, ...props }: TableProps) => {
	const [parsedColumns, setParsedColumns] = useState([]);

	useEffect(() => {
		setParsedColumns(
			columns.map((column) => {
				/**
				 * If the title prop is of type "function" a render function is used,
				 * we assume the developer knows what they want to render
				 * so we just return the column.
				 */
				if (typeof column.title === "function") {
					return column;
				}

				/**
				 * If an icon is specified we use this helper component to
				 * easily render table headers with icons without having to
				 * use a render function every time a header with an icon
				 * is required.
				 */
				if (column.icon) {
					const { icon, title, titleClassName, iconSize } = column;
					return Object.assign({}, column, {
						title: () => (
							<TableHeaderCell
								label={title as string}
								icon={icon}
								iconSize={iconSize}
								className={titleClassName}
							/>
						),
					});
				}

				/**
				 * If none of the above statements are true the column title
				 * is a regular string; nothing needs to happen.
				 */
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
