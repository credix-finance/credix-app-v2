import { Button } from "@components/Button";
import { Card } from "@components/Card";
import { Statistic } from "@components/Statistic";
import type { NextPage } from "next";

const Overview: NextPage = () => {
	const tvl = 14_800_000;
	const apy = 0.138;
	const creditOutstanding = 12_300_000;

	const parties = [
		{
			name: "liquidity providers",
			action: "invest",
			buttonAction: "Invest",
			description:
				"Stable return, flexibility to withdraw at any moment and invest in senior tranche = liquidity pool.",
		},
		{
			name: "Borrowers",
			action: "borrow",
			buttonAction: "deals",
			description:
				"Stable return, flexibility to withdraw at any moment and invest in senior tranche = liquidity pool.",
		},
	];

	return (
		<main
			id="index"
			className="grid grid-cols-1 grid-auto-rows-min gap-y-8 md:grid-cols-12 md:gap-y-12 md:gap-x-14 justify-items-center p-4 pt-8 md:p-8 lg:pt-16 lg:max-w-6xl lg:justify-self-center"
		>
			<div className="text-center md:col-span-12 md:max-w-3xl grid justify-items-center">
				<h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold font-sans">
					Welcome to Credix
				</h1>
				<div className="font-normal text-base md:max-w-lg">
					The new decentralized credit marketplace connecting investors with FinTechs in emerging
					markets
				</div>
			</div>
			<div className="md:col-span-4 w-full flex justify-center">
				<Statistic label="TVL" currency="USDC" value={tvl} />
			</div>
			<div className="md:col-span-4 w-full flex justify-center">
				<Statistic label="Estimatded APY" isPercentage={true} value={apy} />
			</div>
			<div className="md:col-span-4 w-full flex justify-center">
				<Statistic label="Credit outstanding" currency="USDC" value={creditOutstanding} />
			</div>
			<div className="ml-6 md:col-span-12 md:flex md:justify-between md:space-x-20 space-y-8 md:space-y-0">
				{parties.map(({ name, action, buttonAction, description }) => (
					<Card key={name} topTitle={name} title={action} offset="large">
						<div className="mb-14 text-base">{description}</div>
						<Button block={true} className="capitalize">
							{buttonAction}
						</Button>
					</Card>
				))}
			</div>
		</main>
	);
};

export default Overview;
