// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { config } from "./src/config";

if (process.env.NODE_ENV !== "test") {
	Sentry.init({
		dsn: `https://${process.env.NEXT_PUBLIC_SENTRY_TOKEN}@o1140639.ingest.sentry.io/6328186`,
		tracesSampleRate: 1.0,
	});
	Sentry.setTag("programId", config.clusterConfig.programId.toString());
	Sentry.setTag("clusterUrl", config.clusterConfig.RPCEndpoint);
}
