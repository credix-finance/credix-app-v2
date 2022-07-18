# Credix app v2

Repository containing the FE application of Credix built with [nextjs](https://nextjs.org/). If you want to see the working product on Solana testnet, go to [app.pre.credix.finance](https://app.pre.credix.finance), connect your wallet, get some SOL from [this faucet](https://www.solfaucet.com), get some USDC from [this faucet](https://www.usdcfaucet.com) and connect your wallet. If you want to spin up a local app, follow the steps as outlined below.

## Getting started

Clone the repository using git

```bash
git clone git@github.com:credix-finance/credix-app-v2.git
```

Install the dependecies by running the following in the source folder:

```bash
yarn install
```

Start the hot-reloading development server by running:

```bash
yarn dev
```

You should now be able to access the app by going to [http://localhost:3000](http://localhost:3000).

## Clusters

You can think of clusters as different development environments, traditionally one of [`development`, `staging`, `production`] but in this project they are [`localnet`, `devnet`, `pre-mainnet`, `mainnet`].

You can target one of the available clusters by setting the `NEXT_PUBLIC_REACT_APP_CLUSTER` environment variable.
The easiest way of setting the variable is by copying the `.env.local.dist` file and renaming it to `.env.local`. The next time you (re)start your `nextjs` server it will automatically be set.

```bash
# Copy the env dist so it's picked up by nextjs
cp .env.local.dist .env.local
```

By default `devnet` is targetted. Sometimes it's preferable to target `localnet` which will be explained next.

### Localnet

Targetting `localnet` means that you'll run a local validator. It has a couple of benefits:

- it makes debugging certain issues easier
- you don't create a lot of bogus data on devnet
- you don't spam [solana devnet]() and get rate limited (or even ip-banned) if you accidentally create a rendering loop
- Actions that normally require a multisig are executed without multiple signers

To target `localnet` edit the `.env.local` file like this:

```diff
- NEXT_PUBLIC_REACT_APP_CLUSTER=devnet
+ NEXT_PUBLIC_REACT_APP_CLUSTER=localnet
```

For this to work your local validator has to be running.
If that's not the case, do the following steps:

Follow the monorepo install and setup instructions found [here](https://github.com/credix-finance/credix-programs).

Start the validator:

```bash
# in credix-programs/packages/program
anchor start
```

In a different terminal window set up the market:

```bash
# in credix-programs/packages/program
sh setup/setup.sh
```

If all went well you should now be able to use the app locally/

More info on setting up a local validator can be found [here](https://docs.solana.com/developing/test-validator).

### Devnet

`devnet` is our development environment (with corresponding branch).

When working on a new feature you usually start by branching from the `devnet` branch.

Each day our CI deploys this branch to [app.dev.credix.finance](https://app.dev.credix.fincance).

### Pre-mainnet

`pre-mainnet` can be compared to a staging environment.

Request limits of the default RPC endpoint:

```
Maximum number of requests per 10 seconds per IP: 100
Maximum number of requests per 10 seconds per IP for a single RPC: 40
Maximum concurrent connections per IP: 40
Maximum connection rate per 10 seconds per IP: 40
Maximum amount of data per 30 second: 100 MB
```

### Mainnet

`mainnet` is our production environement.

Request limits of the default RPC endpoint:

```
Maximum number of requests per 10 seconds per IP: 100
Maximum number of requests per 10 seconds per IP for a single RPC: 40
Maximum concurrent connections per IP: 40
Maximum connection rate per 10 seconds per IP: 40
Maximum amount of data per 30 second: 100 MB
```

# Development

## Styling

We use [tailwindcss](https://tailwindcss.com/) as our "css framework". If you're new to tailwind you can find the docs [here](https://tailwindcss.com/docs/installation).
Their [screencasts](https://www.youtube.com/tailwindlabs) provide a good introduction.

## Components

[Ant design](https://ant.design/) is the component library we use. Dive into their [docs](https://ant.design/docs/react/introduce) if you want to learn more, or check out this [overview](https://ant.design/components/overview/) of their components.

We also use their chart libary: [ant charts](https://charts.ant.design/en). They have pretty good documentation but some of it is in chinese which can make it a bit tricky to use sometimes.

### classNames

`classNames` is a util function that you will come across often. It is used to easily add conditional classes to components.
A useage example:

```tsx
const className = classNames([
	isCondition ? "class-a" : "class-b",
	isOtherCondition && "class-c",
	"class-d class-e",
]);
```

Without using the `classNames` function you potientially end up with `false` or `undefined` in the class list.

## Theme configuration

This repository contains a `theme.js` file which is responsible for being the single source of truth when it comes to the Credix brand colors. It also includes the shared configuration code between the configuration files of NextJS, TailwindCSS and Storybook (`next.config.js`, `tailwind.config.js` and `.storybook/main.js` respectively).

When referencing the brand colors in code make sure to use the custom tailwind varaibles that are found in `theme.js` as the `colors` object.
For example:

```html
<div className="bg-credix-primary">Hello</div>
```

Dark mode is supported by using the tailwind `dark:` modifier. AntDesign does have a dark theme, but it's a separate `.less` file and does not support the prefers-color-scheme media feature out of the box.

## Identity verification

We use [Civic](https://www.civic.com/) as our identity verification provider. You'll need to go through their process if you want to perform transactions on `devnet` or `mainnet`.

## I18n

We use the [formatjs/react-intl](https://formatjs.io/docs/react-intl/) package for tagging and extracting our translation strings.

### Tagging strings for extraction

When adding new text strings, always wrap them in a `intl.formatMessage()` function call with a default message to mark them for extraction.

Messages are defined in the same file as they are used as a const:

```typescript
import React from "react";
import { defineMessages } from "react-intl";

const MESSAGES = defineMessages({
	hello: {
		defaultMessage: "Hello world",
		description: "app: hello world",
	},
});

const App = () => {
	return <div>{MESSAGES.hello}</div>;
};
```

The docs say the following about where you should place you messages:

> 1. Messages colocated with their usages become self-managed, as their usages change/removed, so are the messages.
> 2. Messages are highly contextual. We've seen a lot of cases where developers assume a certain grammar when they write their messages. Buttons/Call-To-Actions and labels are also translated differently.
> 3. Text styling is also dependent on the message itself. Things like truncation, capitalization... certainly affect the messages themselves.
> 4. Better integrations with toolchains. Most toolchains cannot verify cross-file references to validate syntax/usage.

### Extraction

To extract the tagged strings run `yarn i18n:extract`. This command will aggregate all `defaultMessage`s from the application into a single `.json` file (`en.json` in our case).

### Compilation

Running `yarn i18n:compile` will compile the lang files from a folder into a `react-intl` consumable `.json` file.

## Editors

We use eslint and prettier to lint and format our codebase. An editorconfig file is also provided.

### Visual Studio Code

#### Extensions

- [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

##### Optional but recommended

- [Formatting Toggle](https://marketplace.visualstudio.com/items?itemName=tombonnike.vscode-status-bar-format-toggle) A VS Code extension that allows you to toggle formatting settings ON and OFF with a simple click.

# Usage

## Available Scripts

In the project directory, you can run:

### `yarn dev`

Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits. You will also see any lint errors in the console.

### `yarn test:unit`

Launches the test runner and runs all the tests.
You can add the `--watch` flag to let the runner watch for changes.

### `yarn cypress:open`

Launches an interactive cypress window where you can start running the e2e testing suite.

### `yarn build`

Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes. Your app is ready to be deployed!

### `yarn storybook`

Runs storybook in development mode. Open [http://localhost:6006](http://localhost:6006) to view it in the browser.
Components are located in `src/components` and stories can be found in `src/stories`.

# Husky

Install [Husky](https://github.com/typicode/husky). We use a pre-push hook to perform linting before hitting the CI/CD pipelines.

Don't forget to run `husky install` once or after new hooks are added.

If you want to bypass this check you can end your git commit with `--no-verify`.
