import { CredixLogo } from "@components/CredixLogo";
import React, { useState } from "react";
import { SignInButton } from "./hackerhouse/SignInButton";
import { WalletButton } from "./WalletButton";

export const MainMenu = () => {
	const [loggedIn, setLoggedIn] = useState<boolean>(false);

	return (
		<div className="w-full bg-neutral-0 flex justify-between items-center py-[16.5px] px-4">
			<div>
				<CredixLogo />
			</div>
			<div className="flex space-x-4">
				<WalletButton />
				<SignInButton
					baseUrl="http://127.0.0.1:8080"
					isLoggedIn={loggedIn}
					callback={() => setLoggedIn(true)}
				/>
			</div>
		</div>
	);
};
