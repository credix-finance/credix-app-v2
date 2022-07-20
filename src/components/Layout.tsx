import React, { ReactNode } from "react";
import { SideMenu } from "@components/SideMenu";
import { MainMenu } from "@components/MainMenu";
import { routes } from "../consts";

interface LayoutProps {
	children?: ReactNode;
}

const WithSideMenu = ({ children }: LayoutProps) => {
	return (
		<div className="grid grid-cols-layout">
			<SideMenu menuItems={routes} />
			{children}
		</div>
	);
};

interface WithMainMenuProps extends LayoutProps {
	showLogo?: boolean;
}

const WithMainMenu = ({ children, showLogo = true }: WithMainMenuProps) => {
	return (
		<div className="grid grid-rows-layout">
			<MainMenu showLogo={showLogo} />
			<div className="flex justify-center">
				<div className="max-w-5xl w-full md:py-20 mx-8 pb-8">{children}</div>
			</div>
		</div>
	);
};

const Layout = ({ children }: LayoutProps) => <>{children}</>;

Layout.WithSideMenu = WithSideMenu;
Layout.WithMainMenu = WithMainMenu;

export default Layout;
