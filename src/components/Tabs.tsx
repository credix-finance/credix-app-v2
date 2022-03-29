import React from "react";
import { Tabs as AntdTabs } from "antd";
import { TabsProps as AntTabsProps } from "antd/lib/tabs";

interface TabsProps {
	tabBarExtraContent: AntTabsProps["tabBarExtraContent"];
	children?: AntTabsProps["children"];
}

export const Tabs = ({ children, ...props }: TabsProps) => {
	return (
		<AntdTabs tabBarGutter={0} {...props}>
			{children}
		</AntdTabs>
	);
};
