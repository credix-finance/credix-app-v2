// log the pageview with their URL
export const pageview = (url: string) => {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	window.gtag("config", process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
		page_path: url,
	});
};

interface EventProps {
	action: string;
	params: object;
}

// log specific events happening.
export const event = ({ action, params }: EventProps) => {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	window.gtag("event", action, params);
};
