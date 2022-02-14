import React from "react";
import { Tabs as AntdTabs } from "antd";
import { TabPaneProps as AntdTabPaneProps } from "antd/lib/tabs";

const { TabPane: AntdTabPane } = AntdTabs;

interface TabPaneProps {
	children?: AntdTabPaneProps["children"];
	tab?: AntdTabPaneProps["tab"];
}

export const TabPane = ({ children, ...props }: TabPaneProps) => {
	return <AntdTabPane {...props}>{children}</AntdTabPane>;
};
