import { Button } from "@components/Button";
import { ColumnsProps, Table } from "@components/Table";
import { DealStatus, Fraction, Market, useCredixClient } from "@credix/credix-client";
import { useAsyncStore } from "@hooks/useAsyncStore";
import { useCredixPass } from "@hooks/useCredixPass";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, TokenAmount } from "@solana/web3.js";
import { DealWithNestedResources } from "@state/dealSlice";
import {
	dealStatusSelector,
	isAdminSelector,
	loadingDealsSelector,
	marketSelector,
	maybeFetchDealsSelector,
} from "@state/selectors";
import { useStore } from "@state/useStore";
import { asyncFilter, asyncMap } from "@utils/async.utils";
import { isDealRepayableByUser, isDealVisible } from "@utils/deal.utils";
import { ratioFormatter } from "@utils/format.utils";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { defineMessages, useIntl } from "react-intl";

interface Props {
	market: Market;
	status: DealStatus;
}

enum DealAction {
	REPAY,
	SHOW,
}

interface TableDeal {
	id: PublicKey;
	name: string;
	principal: TokenAmount;
	financingFee: string;
	trancheSizePercentages: number[];
	action: DealAction;
}

// TODO: we need to store an array of deals and tables (deal pk -> schedule & deal pk -> tranches)
// We list deals so being able to easily iterate is nice. We only use schedules and tranches in the context of a deal so when the pk is available.
export const DealsTable = (props: Props) => {
	const intl = useIntl();
	const selector = useMemo(() => dealStatusSelector(props.status), [props.status]);
	const deals = useAsyncStore(selector);
	const [tableDeals, setTableDeals] = useState<TableDeal[]>([]);
	const maybeFetchDeals = useStore(maybeFetchDealsSelector);
	const client = useCredixClient();
	const isLoadingDeals = useStore(loadingDealsSelector);
	const router = useRouter();
	const { marketplace } = router.query;
	const market = useStore(marketSelector);
	const wallet = useWallet();
	const isAdmin = useStore(isAdminSelector);
	const credixPass = useCredixPass();

	// TODO: separate component?
	const renderDealActionButton = (action: DealAction, id: PublicKey) => {
		const path = `/${marketplace}/deals/show?dealId=${id.toString()}`;
		let buttonText = "";

		switch (action) {
			case DealAction.REPAY:
				buttonText = intl.formatMessage(MESSAGES.repay);
				break;
			case DealAction.SHOW:
				buttonText = intl.formatMessage(MESSAGES.show);
		}

		return (
			<Link href={path}>
				<a>
					<Button>
						<span className="capitalize">{buttonText}</span>
					</Button>
				</a>
			</Link>
		);
	};

	const columns: ColumnsProps[] = [
		{
			title: intl.formatMessage(MESSAGES.name),
			icon: "stacked-column-down",
			dataIndex: "name",
			key: "name",
			width: 250,
			ellipsis: true,
		},
		{
			title: intl.formatMessage(MESSAGES.amount),
			dataIndex: "principal",
			key: "principal",
			width: 250,
			titleClassName: "justify-end",
			align: "right",
			render: (principal: TokenAmount) => (
				<span className="font-medium text-lg">{principal.uiAmount} USDC</span>
			),
		},
		{
			title: intl.formatMessage(MESSAGES.financingFee),
			key: "financingFee",
			titleClassName: "justify-end",
			align: "right",
			width: 160,
			dataIndex: "financingFee",
			render: (financingFee: string) => <span className="font-medium text-lg">{financingFee}</span>,
		},
		{
			title: intl.formatMessage(MESSAGES.trancheStructure),
			key: "trancheStructure",
			dataIndex: "trancheSizePercentages",
			width: 150,
			titleClassName: "justify-end",
			align: "right",
			render: (tranches: number[]) => (
				<span className="font-medium text-lg">
					{`(${tranches.reduce((r, s) => `${r}/${s}`, "").substring(1)})`}
				</span>
			),
		},
		{
			dataIndex: "action",
			key: "action",
			width: 138,
			className: "flex justify-end",
			// Invisible title so that the table layout isn't messed up
			title: () => <div className="invisible">Repay</div>,
			titleClassName: "table-cell",
			render: (action: DealAction, deal: TableDeal) => renderDealActionButton(action, deal.id),
		},
	];

	useEffect(() => {
		const mapDealsToTableDeals = async (deals: DealWithNestedResources[] | null) => {
			if (!deals) {
				setTableDeals([]);
				return;
			}

			const visibleDeals = await asyncFilter(deals, async (d) =>
				isDealVisible(wallet?.publicKey, d, credixPass, isAdmin)
			);

			const tableDeals: TableDeal[] = await asyncMap(visibleDeals, async (d) => {
				const repaymentSchedule = d.repaymentSchedule;
				const tranches = d.tranches;
				const structure = tranches.tranches.map((t) => {
					const fraction = new Fraction(
						Number(t.size.amount),
						Number(repaymentSchedule.totalPrincipal.amount)
					);

					return fraction.toNumber() * 100;
				});

				const repayable = await isDealRepayableByUser(wallet.publicKey, d, credixPass);
				const financingFee = await d.repaymentSchedule.calculateFinancingFee();

				return {
					name: d.name,
					id: d.address,
					principal: repaymentSchedule.totalPrincipal,
					financingFee: ratioFormatter.format(financingFee.toNumber()),
					trancheSizePercentages: structure,
					action: repayable ? DealAction.REPAY : DealAction.SHOW,
				};
			});

			setTableDeals(tableDeals);
		};

		mapDealsToTableDeals(deals);
	}, [deals, wallet.publicKey, isAdmin, credixPass]);

	useEffect(() => {
		if (!market) {
			return;
		}

		maybeFetchDeals(client, market);
	}, [client, market, maybeFetchDeals]);

	return (
		<Table loading={isLoadingDeals} dataSource={tableDeals} columns={columns} rowKey="name"></Table>
	);
};

const MESSAGES = defineMessages({
	repay: {
		defaultMessage: "Repay",
		description: "deal table repay action button text",
	},
	show: {
		defaultMessage: "Show",
		description: "deal table show action button text",
	},
	name: {
		defaultMessage: "Name",
		description: "deal table name column title",
	},
	amount: {
		defaultMessage: "Amount",
		description: "deal table amount column title",
	},
	financingFee: {
		defaultMessage: "Financing fee",
		description: "deal table financingFee title",
	},
	trancheStructure: {
		defaultMessage: "Tranches",
		description: "deal table tranche structure title",
	},
});
