import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { Form } from "antd";
import { useForm } from "antd/lib/form/Form";
import type { NextPage } from "next";
import { useState } from "react";

export interface User {
	firstName: string;
	lastName: string;
	keys: string[];
}

const Overview: NextPage = () => {
	// const wallet = useWallet();
	/* const [walletMessage, setWalletMessage] = useState<string>("Connect your wallet");
	const token = useStore((state) => state.token);
	const setToken = useStore((state) => state.setToken); */

	//////////
	const [editing, setEditing] = useState<boolean>(false);
	const [user] = useState<User | undefined>(undefined);

	// const [form] = Form.useForm();

	const edit = (values: any) => {
		console.log("asfdasf", values);
		if (editing) {
			/* const data = {
				firstName:
			} */
		}

		setEditing(false);
	};

	return (
		<main
			id="index"
			className="grid grid-cols-1 grid-auto-rows-min gap-y-8 md:grid-cols-12 md:gap-y-12 md:gap-x-14 justify-items-center p-4 pt-8 md:p-8 lg:pt-16 lg:max-w-6xl lg:justify-self-center"
		>
			<div className="text-center md:col-span-12 md:max-w-3xl grid justify-items-center">
				<h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold font-sans">
					Hackerhouse Prague
				</h1>
				<Form onFinish={edit} name="bla" onFinishFailed={console.log}>
					<Input label="first name" disabled={!editing} value={user?.firstName} name="firstName" />
					<Input label="last name" disabled={!editing} value={user?.lastName} name="lastName" />
					{editing && (
						<Form.Item>
							<Button htmlType="submit" type="primary">
								Save
							</Button>
						</Form.Item>
					)}
					{!editing && <Button onClick={() => setEditing(true)}>Edit</Button>}
				</Form>
			</div>
		</main>
	);
};

export default Overview;
