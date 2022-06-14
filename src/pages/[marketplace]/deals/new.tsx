import DealForm, { DealFormInput } from "@components/DealForm";
import Layout from "@components/Layout";
import { Link } from "@components/Link";
import { Deal, Fraction, useCredixClient } from "@credix/credix-client";
import { PublicKey } from "@solana/web3.js";
import { getMarketsPaths } from "@utils/export.utils";
import { compactFormatter, toProgramAmount } from "@utils/format.utils";
import Big from "big.js";
import message from "message";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "pages/_app";
import React, { ReactElement, useEffect } from "react";
import { useStore } from "state/useStore";
import loadIntlMessages from "@utils/i18n.utils";
import { useIntl } from "react-intl";
import { repaymentSchedule as bulletSchedule } from "@utils/bullet.utils";
import { repaymentSchedule as amortizationSchedule } from "@utils/amortization.utils";
import { DAYS_IN_REPAYMENT_PERIOD, DAYS_IN_YEAR } from "@consts";

const New: NextPageWithLayout = () => {
	const router = useRouter();
	const { marketplace } = router.query;
	const client = useCredixClient();
	const fetchMarket = useStore((state) => state.fetchMarket);
	const market = useStore((state) => state.market);
	const intl = useIntl();

	useEffect(() => {
		fetchMarket(client, marketplace as string);
	}, [client, fetchMarket, marketplace]);

	const checkCredixPass = async (borrower: PublicKey) => {
		const hide = message.loading({
			content: intl.formatMessage({
				defaultMessage: "Checking Credix Pass",
				description: "New deal: Credix Pass validation loading",
			}),
		});

		try {
			const credixPass = await market.fetchCredixPass(borrower);

			if (!credixPass) {
				hide();
				message.error({
					content: intl.formatMessage({
						defaultMessage: "No Credix Pass found for given public key",
						description: "New deal: Credix Pass validation failed",
					}),
				});
				return;
			}
		} catch {
			hide();
			message.error({
				content: intl.formatMessage({
					defaultMessage: "Failed to get Credix pass for given public key",
					description: "New deal: Credix Pass request failed",
				}),
			});
			return;
		}

		hide();
	};

	const createDeal = async (
		principal: number,
		formattedPrincipal: string,
		borrower: PublicKey,
		dealName: string
	) => {
		const hide = message.loading({
			content: intl.formatMessage(
				{
					defaultMessage: "Creating deal for {amount} USDC",
					description: "New deal: create deal loading",
				},
				{
					amount: formattedPrincipal,
				}
			),
		});

		try {
			const defaults = {
				lateFeePercentage: new Fraction(0, 100),
				maxFundingDuration: 255,
				trueWaterfall: true,
				slashInterestToPrincipal: true,
				slashPrincipalToInterest: true,
			};

			const principalProgramAmount = toProgramAmount(new Big(principal)).toNumber();

			await market.createDeal({
				borrower: borrower,
				lateFeePercentage: defaults.lateFeePercentage,
				maxFundingDuration: defaults.maxFundingDuration,
				name: dealName,
				trueWaterfall: defaults.trueWaterfall,
				slashInterestToPrincipal: defaults.slashInterestToPrincipal,
				slashPrincipalToInterest: defaults.slashPrincipalToInterest,
			});
			hide();
		} catch (error) {
			hide();
			message.error({
				content: intl.formatMessage(
					{
						defaultMessage: "Failed to create deal for {amount} USDC",
						description: "New deal: deal creation failed",
					},
					{
						amount: formattedPrincipal,
					}
				),
			});
			return;
		}
	};

	const addTrancheConfig = async (deal: Deal, formattedPrincipal: string) => {
		const hide = message.loading({
			content: intl.formatMessage({
				defaultMessage: "Adding tranches to deal",
				description: "New deal: add tranches schedule loading",
			}),
		});

		try {
			await deal.setTranches([
				{
					size: new Fraction(1, 1),
					earlyWithdrawalInterest: true,
					earlyWithdrawalPrincipal: true,
					maxDepositPercentage: new Fraction(1, 1),
					returnPercentage: new Fraction(1, 1),
				},
			]);

			hide();
			message.success({
				content: intl.formatMessage(
					{
						defaultMessage: "Successfully created deal for {amount} USDC",
						description: "New deal: deal creation success",
					},
					{
						amount: formattedPrincipal,
					}
				),
			});

			return deal;
		} catch {
			hide();
			message.error({
				content: intl.formatMessage({
					defaultMessage: "Failed to add tranches to deal",
					description: "New deal: deal add tranches request failed",
				}),
			});
		}
	};

	const addRepaymentSchedule = async (
		deal: Deal,
		repaymentType: string,
		principal: number,
		financingFee: number,
		timeToMaturity: number
	) => {
		const hide = message.loading({
			content: intl.formatMessage({
				defaultMessage: "Adding repayment schedule to deal",
				description: "New deal: add repayment schedule loading",
			}),
		});

		const schedule = (
			repaymentType === "amortization"
				? amortizationSchedule(principal, new Fraction(financingFee, 100), timeToMaturity)
				: bulletSchedule(principal, new Fraction(financingFee, 100), timeToMaturity)
		).map((period: { interest: number; principal: number }) => {
			return {
				interest: period.interest,
				principal: period.principal,
			};
		});

		try {
			await deal.setRepaymentSchedule({
				daysInYear: DAYS_IN_YEAR,
				periodDuration: DAYS_IN_REPAYMENT_PERIOD,
				periods: schedule,
			});
			hide();

			return deal;
		} catch {
			hide();

			message.error({
				content: intl.formatMessage({
					defaultMessage: "Failed to add repayment schedule to deal",
					description: "New deal: deal add repayment schedule request failed",
				}),
			});
		}
	};

	const getDealInfo = async (borrower: PublicKey) => {
		try {
			const borrowerInfo = await market.fetchBorrowerInfo(borrower);
			const deal = await borrowerInfo.fetchDeal(borrowerInfo.numberOfDeals - 1);

			return deal;
		} catch {
			message.error({
				content: intl.formatMessage({
					defaultMessage: "Failed to get deal info",
					description: "New deal: deal info request failed",
				}),
			});
			router.push(`/${marketplace}/deals`);
		}
	};

	const onSubmit = async ({
		principal,
		financingFee,
		timeToMaturity,
		borrower,
		dealName,
		repaymentType,
	}: DealFormInput) => {
		const borrowerPK = new PublicKey(borrower);
		const formattedPrincipal = compactFormatter.format(principal);

		await checkCredixPass(borrowerPK)
			.then(async () => await createDeal(principal, formattedPrincipal, borrowerPK, dealName))
			.then(async () => await getDealInfo(borrowerPK))
			.then(
				async (deal: Deal) =>
					await addRepaymentSchedule(deal, repaymentType, principal, financingFee, timeToMaturity)
			)
			.then(async (deal: Deal) => await addTrancheConfig(deal, formattedPrincipal))
			.then((deal: Deal) =>
				router.push(`/${marketplace}/deals/show?dealId=${deal.address.toString()}`)
			);
	};

	return (
		<div className="py-5 px-4 md:p-20 md:justify-self-center w-full">
			<Link to={`/${marketplace}/deals`} label="Go back to all deals" icon="chevron-left-square" />
			<div className="text-4xl font-sans pt-3 mb-8 capitalize">
				{intl.formatMessage({
					defaultMessage: "create new deal",
					description: "New deal: title",
				})}
			</div>
			<DealForm onSubmit={onSubmit} />
		</div>
	);
};

New.getLayout = function getLayout(page: ReactElement) {
	return (
		<Layout.WithSideMenu>
			<Layout.WithMainMenu showLogo={false}>{page}</Layout.WithMainMenu>
		</Layout.WithSideMenu>
	);
};

export async function getStaticPaths() {
	return {
		paths: getMarketsPaths(),
		fallback: true,
	};
}

export async function getStaticProps(ctx) {
	const { params } = ctx;
	return {
		props: {
			intlMessages: await loadIntlMessages(ctx),
			...params,
		},
	};
}

export default New;
