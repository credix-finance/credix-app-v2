# Credix Client v2

Repository containing the FE application of Credix. If you want to see the working product on Solana testnet, go to [app.credix.finance](https://app.credix.finance), connect your wallet, get some SOL from [this faucet](https://www.solfaucet.com), get some USDC from [this faucet](https://www.usdcfaucet.com) and connect your wallet. If you want to spin up a local clients, follow the steps as outlined below.

# Development

#### Theme configuration

This repository contains a `theme.js` file which is responsible for being the single source of truth when it comes to the Credix brand colors. It also includes the shared configuration code between the configuration files of NextJS, TailwindCSS and Storybook (`next.config.js`, `tailwind.config.js` and `.storybook/main.js` respectively).

When referencing the brand colors in code make sure to use the custom tailwind varaibles that are found in `theme.js` as the `colors` object.
For example:

```html
<div className="bg-credix-primary">Hello</div>
```

Dark mode is supported by using the tailwind `dark:` modifier. AntDesign does have a dark theme, but it's a separate `.less` file and does not support the prefers-color-scheme media feature out of the box.

#### Localnet

When using localnet, be sure to run

```sh
$ solana-test-validator
```

This will spin up a local validator that our client interacts with. More info on setting up a local validator can be found [here](https://docs.solana.com/developing/test-validator).

#### Devnet

Program address is `CRDx2YkdtYtGZXGHZ59wNv1EwKHQndnRc1gT4p8i2vPX`

Request limits of the default RPC endpoint:

```
Maximum number of requests per 10 seconds per IP: 100
Maximum number of requests per 10 seconds per IP for a single RPC: 40
Maximum concurrent connections per IP: 40
Maximum connection rate per 10 seconds per IP: 40
Maximum amount of data per 30 second: 100 MB
```

#### Mainnet

Program address is `CRDx2YkdtYtGZXGHZ59wNv1EwKHQndnRc1gT4p8i2vPX`.

Request limits of the default RPC endpoint:

```
Maximum number of requests per 10 seconds per IP: 100
Maximum number of requests per 10 seconds per IP for a single RPC: 40
Maximum concurrent connections per IP: 40
Maximum connection rate per 10 seconds per IP: 40
Maximum amount of data per 30 second: 100 MB
```

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

### `yarn build`

Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes. Your app is ready to be deployed!

### `yarn storybook`

Runs storybook in development mode. Open [http://localhost:6006](http://localhost:6006) to view it in the browser.
Components are located in `src/components` and stories can be found in `src/stories`.
