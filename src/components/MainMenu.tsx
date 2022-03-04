import { CredixLogo } from "@components/CredixLogo";
import axios from "axios";
import { User } from "pages";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import create from "zustand";
import { SignInButton } from "./hackerhouse/SignInButton";
import { persist } from "zustand/middleware";

type Store = {
	user: User;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	setUser: (u: User) => void;
	accessToken: string;
	setAccessToken: (t: string) => void;
};

export const useStore = create<Store>(
	persist(
		(set) => ({
			user: null,
			setUser: (user: User) => set((state) => ({ ...state, user: user })),
			accessToken: null,
			setAccessToken: (t: string) => set((state) => ({ ...state, accessToken: t })),
		}),
		{
			name: "storage",
		}
	)
);

export const MainMenu = () => {
	const [loggedIn, setLoggedIn] = useState<boolean>(false);
	const [started, setStarted] = useState<boolean>(false);
	const baseUrl = "http://127.0.0.1:8080";

	const { setUser, setAccessToken, accessToken } = useStore((state) => ({
		setUser: state.setUser,
		setAccessToken: state.setAccessToken,
		accessToken: state.accessToken,
	}));

	const client = useMemo(() => {
		console.log("creating client with token", accessToken);
		return axios.create({
			baseURL: baseUrl,
			headers: { Authorization: accessToken ? `Bearer ${accessToken}` : undefined },
		});
	}, [baseUrl, accessToken]);

	const getMe = useCallback(async () => {
		console.log("getting me");
		try {
			const response = await client.get("/api/users/me");
			setLoggedIn(true);
			console.log("user", response);
		} catch (e) {
			if (e.response && e.response.status === 401) {
				setLoggedIn(false);
				console.log("not logged in");
			}
		}
	}, [client]);

	const start = useCallback(async () => {
		await getMe();
		setStarted(true);
		console.log("started");
	}, [getMe]);

	useEffect(() => {
		if (!started) {
			console.log("starting");
			start();
		}
	}, [started, start]);

	const callback = (e, r) => {
		if (r) {
			client.defaults.headers["Authorization"] = `Bearer ${r.data.access_token}`;
			setLoggedIn(true);
			getMe();
			setAccessToken(r.data.access_token);
			console.log("logged in");
		}
	};

	return (
		<div className="w-full bg-neutral-0 flex justify-between items-center py-[16.5px] px-4">
			<div>
				<CredixLogo />
			</div>
			<div className="flex space-x-4">
				<SignInButton baseUrl="http://127.0.0.1:8080" isLoggedIn={loggedIn} onSignIn={callback} />
			</div>
		</div>
	);
};
