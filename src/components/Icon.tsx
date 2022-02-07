import React from "react";

type IconNames = "bookmark" | "wallet";

interface IconProps {
	name: IconNames;
	className?: string;
}

export const Icon = ({ name, className }: IconProps) => {
	const defaultClassNames = "w-4 h-4 fill-current";
	className = `${defaultClassNames} ${className ? className : ""}`;

	switch (name) {
		case "bookmark":
			return (
				<svg className={className} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
					<path d="M2.66699 4.66659C2.66699 2.82564 4.15938 1.33325 6.00033 1.33325H10.0003C11.8412 1.33325 13.3336 2.82564 13.3336 4.66659V12.6594C13.3336 14.3619 11.3421 15.2859 10.0421 14.1865L8.43082 12.8238C8.1823 12.6136 7.81834 12.6136 7.56982 12.8238L5.95848 14.1865C4.65855 15.2859 2.66699 14.3619 2.66699 12.6594V4.66659ZM6.00033 2.66659C4.89576 2.66659 4.00033 3.56202 4.00033 4.66659V12.6594C4.00033 13.2269 4.66418 13.5349 5.09749 13.1684L6.70883 11.8057C7.45439 11.1752 8.54626 11.1752 9.29182 11.8057L10.9031 13.1684C11.3364 13.5349 12.0003 13.2269 12.0003 12.6594V4.66659C12.0003 3.56202 11.1049 2.66659 10.0003 2.66659H6.00033Z" />
				</svg>
			);
		case "wallet":
			return (
				<svg className={className} viewBox="0 0 24 25" xmlns="http://www.w3.org/2000/svg">
					<path d="M17 9.5h5v6h-5a3 3 0 1 1 0-6Zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
					<path d="M7.759 4.5h8.482c.805 0 1.47 0 2.01.044.563.046 1.08.145 1.565.392a4 4 0 0 1 1.748 1.748c.247.485.346 1.002.392 1.564.044.541.044 1.206.044 2.01v4.483c0 .805 0 1.47-.044 2.01-.046.563-.145 1.08-.392 1.565a4 4 0 0 1-1.748 1.748c-.485.247-1.002.346-1.564.392-.541.044-1.206.044-2.01.044H7.758c-.805 0-1.47 0-2.01-.044-.563-.046-1.08-.145-1.565-.392a4 4 0 0 1-1.748-1.748c-.247-.485-.346-1.002-.392-1.564C2 16.21 2 15.546 2 14.742v-4.483c0-.805 0-1.47.044-2.01.046-.563.145-1.08.392-1.565a4 4 0 0 1 1.748-1.748c.485-.247 1.002-.346 1.564-.392C6.29 4.5 6.954 4.5 7.758 4.5ZM5.91 6.538c-.438.035-.663.1-.819.18a2 2 0 0 0-.874.874c-.08.156-.145.38-.18.819C4 8.861 4 9.443 4 10.3v4.4c0 .857 0 1.439.038 1.889.035.438.1.663.18.819a2 2 0 0 0 .874.874c.156.08.38.145.819.18.45.037 1.032.038 1.889.038h8.4c.857 0 1.439 0 1.889-.038.438-.035.663-.1.819-.18a2 2 0 0 0 .874-.874c.08-.156.145-.38.18-.819.037-.45.038-1.032.038-1.889v-4.4c0-.857 0-1.439-.038-1.889-.035-.438-.1-.663-.18-.819a2 2 0 0 0-.874-.874c-.156-.08-.38-.145-.819-.18-.45-.037-1.032-.038-1.889-.038H7.8c-.857 0-1.439 0-1.889.038Z" />
				</svg>
			);
		default:
			return null;
	}
};