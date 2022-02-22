import React from "react";
import { LiquidityPoolInteraction } from "@components/LiquidityPoolInteraction";
import { TabPane } from "@components/TabPane";
import { Tabs } from "@components/Tabs";

export const InvestWithdraw = () => {
	// TODO: hook this up with to the client
	const withdraw = (values) => console.log(values);
	const invest = (values) => console.log(values);

	return (
		<Tabs>
			<TabPane tab="Invest" key="1">
				<LiquidityPoolInteraction action="invest" onSubmit={invest} onSubmitFailed={() => null} />
			</TabPane>
			<TabPane tab="Withdraw" key="2">
				<LiquidityPoolInteraction
					action="withdraw"
					onSubmit={withdraw}
					onSubmitFailed={() => null}
				/>
			</TabPane>
		</Tabs>
	);
};
