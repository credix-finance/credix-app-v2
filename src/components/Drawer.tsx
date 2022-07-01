import { FunctionComponent } from "react";
import { Drawer as AntDrawer } from "antd";
import * as theme from "../../theme";
import { classNames } from "@utils/format.utils";
import { IconName, Icon, IconDimension } from "./Icon";
import { Button } from "./Button";

export interface DrawerProps {
	title: string;
	titleIcon: IconName;
	children?: React.ReactNode;
	visible: boolean;
	onClose: () => void;
	onCancel: () => void;
	onSave: () => void;
	className?: string;
}

export const Drawer: FunctionComponent<DrawerProps> = ({
	title,
	titleIcon,
	children,
	visible,
	className,
	onClose,
	onCancel,
	onSave,
}) => {
	className = classNames([className]);
	return (
		<AntDrawer
			bodyStyle={{
				paddingLeft: 80,
				paddingRight: 80,
				paddingTop: 160,
				backgroundColor: theme.colors.credix.primary,
			}}
			className={className}
			placement="right"
			onClose={onClose}
			visible={visible}
			closable={false}
			width={640}
		>
			<div className="space-y-16">
				<div className="font-semibold text-3xl flex items-center font-sans">
					{titleIcon && <Icon name={titleIcon} size={IconDimension.MIDDLE} className="mr-8" />}
					{title}
				</div>
				<div>{children}</div>
				<div>
					<div className="w-full h-[1px] mt-10  bg-neutral-105"></div>
					<div className="flex space-x-6">
						<Button type="default" className="mt-8" onClick={onCancel}>
							Cancel
						</Button>
						<Button
							className="mt-8"
							icon={<Icon name="check-square" size={IconDimension.MIDDLE} />}
							onClick={onSave}
						>
							Save changes
						</Button>
					</div>
				</div>
			</div>
		</AntDrawer>
	);
};
