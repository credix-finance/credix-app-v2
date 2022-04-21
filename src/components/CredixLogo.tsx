import React from "react";

export enum CredixLogoType {
	DARK = "dark",
	LIGHT = "light",
}
interface CredixLogoProps {
	className?: string;
	mode?: CredixLogoType;
}

const CredixLogoLight = ({ className = "" }: Pick<CredixLogoProps, "className">) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			id="Layer_1"
			data-name="Layer 1"
			viewBox="187.95 93.98 59.68 82.96"
			className={`w-7 h-10 text-black ${className}`}
			fill="currentColor"
		>
			<path d="M188,105.28c0-7.23,2.66-11.3,8.19-11.3,4.23,0,6.17,2.44,7.17,5.41l-3.16,1.07c-.66-2-1.56-3.57-4-3.57-3.09,0-4.44,2.53-4.44,6.54v3.69c0,4,1.35,6.54,4.44,6.54,2.48,0,3.38-1.56,4-3.56l3.16,1.06c-1,3-2.94,5.41-7.17,5.41C190.61,116.57,188,112.51,188,105.28Z" />
			<path d="M214.15,116.2h-3.48V94.36h8.17c4.13,0,6.41,2.5,6.41,6.57,0,3.31-1.68,5.63-4.72,6.13l5,9.14h-3.88l-4.64-8.83h-2.9Zm4.19-11.64c2.19,0,3.25-1,3.25-3v-1.34c0-2-1.06-3-3.25-3h-4.19v7.29Z" />
			<path d="M232.65,116.2V94.36h13.67V97.3H236.15v6.35H246v2.94h-9.8v6.67h10.17v2.94Z" />
			<path d="M188,129.34h6.51c5.53,0,8.23,3.82,8.23,10.92s-2.7,10.93-8.23,10.93H188Zm6.29,19c3.19,0,4.75-2.26,4.75-6.23v-3.63c0-4-1.56-6.23-4.75-6.23h-2.82v16.09Z" />
			<path d="M209.79,151.19v-2.66h5.14V132h-5.14v-2.66h13.77V132h-5.13v16.53h5.13v2.66Z" />
			<path d="M247.42,151.19h-4L241,146.87l-2.32-4.13h-.18l-2.38,4.13-2.57,4.32H229.8L236.49,140l-6.28-10.64h4l2.22,3.91,2.25,4h.16l2.25-4,2.32-3.91h3.72L240.78,140Z" />
			<rect x="187.95" y="173.94" width="59.68" height="3" />
		</svg>
	);
};

const CredixLogoDark = ({ className = "" }: Pick<CredixLogoProps, "className">) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			id="Layer_1"
			data-name="Layer 1"
			viewBox="187.95 93.98 59.68 82.96"
			className={`w-7 h-10 text-white ${className}`}
			fill="currentColor"
		>
			<path d="M188,105.28c0-7.23,2.66-11.3,8.19-11.3,4.23,0,6.17,2.44,7.17,5.41l-3.16,1.07c-.66-2-1.56-3.57-4-3.57-3.09,0-4.44,2.53-4.44,6.54v3.69c0,4,1.35,6.54,4.44,6.54,2.48,0,3.38-1.56,4-3.56l3.16,1.06c-1,3-2.94,5.41-7.17,5.41C190.61,116.57,188,112.51,188,105.28Z" />
			<path d="M214.15,116.2h-3.48V94.36h8.17c4.13,0,6.41,2.5,6.41,6.57,0,3.31-1.68,5.63-4.72,6.13l5,9.14h-3.88l-4.64-8.83h-2.9Zm4.19-11.64c2.19,0,3.25-1,3.25-3v-1.34c0-2-1.06-3-3.25-3h-4.19v7.29Z" />
			<path d="M232.65,116.2V94.36h13.67V97.3H236.15v6.35H246v2.94h-9.8v6.67h10.17v2.94Z" />
			<path d="M188,129.34h6.51c5.53,0,8.23,3.82,8.23,10.92s-2.7,10.93-8.23,10.93H188Zm6.29,19c3.19,0,4.75-2.26,4.75-6.23v-3.63c0-4-1.56-6.23-4.75-6.23h-2.82v16.09Z" />
			<path d="M209.79,151.19v-2.66h5.14V132h-5.14v-2.66h13.77V132h-5.13v16.53h5.13v2.66Z" />
			<path d="M247.42,151.19h-4L241,146.87l-2.32-4.13h-.18l-2.38,4.13-2.57,4.32H229.8L236.49,140l-6.28-10.64h4l2.22,3.91,2.25,4h.16l2.25-4,2.32-3.91h3.72L240.78,140Z" />
			<rect x="187.95" y="173.94" width="59.68" height="3" />
		</svg>
	);
};

export const CredixLogo = ({ className = "", mode }: CredixLogoProps) => {
	if (!mode) {
		return (
			<>
				<CredixLogoDark className={`hidden dark:block ${className}`} />
				<CredixLogoLight className={`block dark:hidden ${className}`} />
			</>
		);
	}

	if (mode === CredixLogoType.LIGHT) {
		return <CredixLogoDark className={className} />;
	} else {
		return <CredixLogoLight className={className} />;
	}
};
