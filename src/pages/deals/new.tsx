import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { Link } from "@components/Link";
import { useCredixClient } from "@credix/credix-client";
import { PublicKey } from "@solana/web3.js";
import { Form } from "antd";
import Big from "big.js";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useStore } from "state/useStore";

const New: NextPage = () => {
	const router = useRouter();
	const { marketplace } = router.query;
	const client = useCredixClient();
	const [form] = Form.useForm();
	const [submitDisabled, setSubmitDisabled] = useState(true);
	const maybeFetchMarket = useStore((state) => state.maybeFetchMarket);
	const market = useStore((state) => state.market);

	useEffect(() => {
		maybeFetchMarket(client, marketplace as string);
	}, [client, maybeFetchMarket, marketplace]);

	const onSubmit = async ({ principal, financingFee, timeToMaturity, borrower, dealName }) => {
		try {
			const borrowerPK = new PublicKey(borrower);
			const principalBN = new Big(principal);
			const dealAddress = await market.createDeal(
				principalBN,
				financingFee,
				timeToMaturity,
				borrowerPK,
				dealName
			);
			// TODO: trigger success message
			router.push(`/deals/${dealAddress}`);
		} catch (e) {
			// TODO: trigger error message
			console.log(e);
		}
	};

	return (
		<div>
			<Link to={`/${marketplace}/deals`} label="Go back to all deals" icon="chevron-left-square" />
			<div className="text-4xl font-sans pt-3 pb-5">New Deal</div>
			<div className="bg-neutral-0 py-10 px-24 space-y-7">
				<Form
					name="deal"
					form={form}
					onFinish={onSubmit}
					layout="vertical"
					onFieldsChange={(_changedFields, fields) =>
						process.browser && setSubmitDisabled(fields.some((field) => !field.value))
					}
					className="max-w-[624px]"
				>
					<Input
						name="dealName"
						label="Deal Name"
						className="bg-neutral-0"
						placeholder="Name"
						type="text"
					/>
					<Input
						name="borrower"
						label="Borrower Key"
						className="bg-neutral-0"
						placeholder="Key"
						type="text"
					/>
					<Input
						name="principal"
						label="Principal"
						className="bg-neutral-0"
						placeholder="Amount"
						type="number"
					/>
					<Input
						name="financingFee"
						label="Financing Fee"
						className="bg-neutral-0"
						placeholder="%"
						type="number"
					/>
					<Input
						name="timeToMaturity"
						label="Time To Maturity"
						className="bg-neutral-0"
						placeholder="days"
						type="number"
					/>
					<Form.Item className="mb-0">
						<Button
							disabled={submitDisabled}
							htmlType="submit"
							className="w-full md:w-max capitalize"
						>
							Create Deal
						</Button>
					</Form.Item>
				</Form>
			</div>
		</div>
	);
};

export default New;
