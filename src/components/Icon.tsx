import React from "react";

export const iconNames = [
	"bookmark",
	"wallet",
	"chevron-left-square",
	"line-chart",
	"coins",
	"timeline",
	"grid",
	"user",
	"chevron-left",
	"chevron-right",
	"ellipsis",
	"stacked-column-down",
	"coins-alt",
	"coin-insert",
	"calendar",
	"trend-up-circle",
	"trend-down-circle",
	"plus-square",
	"exclamation-circle",
	"check-circle",
	"check-square",
	"arrow-down",
	"arrow-down-square-solid",
] as const;
export type IconName = typeof iconNames[number];

interface IconProps {
	name: IconName;
	size?: IconDimension;
	className?: string;
}

export enum IconDimension {
	SMALL = "w-4 h-4",
	MIDDLE = "w-6 h-6",
	LARGE = "w-8 h-8",
}

export const Icon = ({ name, className, size }: IconProps) => {
	className = [className, size, "fill-current"].filter(Boolean).join(" ");

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
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M17 9.5H22V15.5H17C15.3431 15.5 14 14.1569 14 12.5C14 10.8431 15.3431 9.5 17 9.5ZM17 13.5C17.5523 13.5 18 13.0523 18 12.5C18 11.9477 17.5523 11.5 17 11.5C16.4477 11.5 16 11.9477 16 12.5C16 13.0523 16.4477 13.5 17 13.5Z"
					/>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M7.7587 4.5H16.2413C17.0463 4.49999 17.7106 4.49998 18.2518 4.54419C18.8139 4.59012 19.3306 4.68868 19.816 4.93597C20.5686 5.31947 21.1805 5.93139 21.564 6.68404C21.8113 7.16937 21.9099 7.68608 21.9558 8.24817C22 8.78936 22 9.45372 22 10.2587V14.7413C22 15.5463 22 16.2106 21.9558 16.7518C21.9099 17.3139 21.8113 17.8306 21.564 18.316C21.1805 19.0686 20.5686 19.6805 19.816 20.064C19.3306 20.3113 18.8139 20.4099 18.2518 20.4558C17.7106 20.5 17.0463 20.5 16.2413 20.5H7.75872C6.95374 20.5 6.28938 20.5 5.74817 20.4558C5.18608 20.4099 4.66937 20.3113 4.18404 20.064C3.43139 19.6805 2.81947 19.0686 2.43597 18.316C2.18868 17.8306 2.09012 17.3139 2.04419 16.7518C1.99998 16.2106 1.99999 15.5463 2 14.7413V10.2587C1.99999 9.45373 1.99998 8.78937 2.04419 8.24818C2.09012 7.68608 2.18868 7.16937 2.43597 6.68404C2.81947 5.93139 3.43139 5.31947 4.18404 4.93597C4.66937 4.68868 5.18608 4.59012 5.74817 4.54419C6.28937 4.49998 6.95373 4.49999 7.7587 4.5ZM5.91104 6.53755C5.47262 6.57337 5.24842 6.6383 5.09202 6.71799C4.7157 6.90973 4.40973 7.2157 4.21799 7.59202C4.1383 7.74842 4.07337 7.97262 4.03755 8.41104C4.00078 8.86113 4 9.44342 4 10.3V14.7C4 15.5566 4.00078 16.1389 4.03755 16.589C4.07337 17.0274 4.1383 17.2516 4.21799 17.408C4.40973 17.7843 4.7157 18.0903 5.09202 18.282C5.24842 18.3617 5.47262 18.4266 5.91104 18.4624C6.36113 18.4992 6.94342 18.5 7.8 18.5H16.2C17.0566 18.5 17.6389 18.4992 18.089 18.4624C18.5274 18.4266 18.7516 18.3617 18.908 18.282C19.2843 18.0903 19.5903 17.7843 19.782 17.408C19.8617 17.2516 19.9266 17.0274 19.9624 16.589C19.9992 16.1389 20 15.5566 20 14.7V10.3C20 9.44342 19.9992 8.86113 19.9624 8.41104C19.9266 7.97262 19.8617 7.74842 19.782 7.59202C19.5903 7.2157 19.2843 6.90973 18.908 6.71799C18.7516 6.6383 18.5274 6.57337 18.089 6.53755C17.6389 6.50078 17.0566 6.5 16.2 6.5H7.8C6.94342 6.5 6.36113 6.50078 5.91104 6.53755Z"
					/>
				</svg>
			);
		case "chevron-left-square":
			return (
				<svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path d="M13.707 8.293a1 1 0 0 1 0 1.414L11.414 12l2.293 2.293a1 1 0 0 1-1.414 1.414l-3-3a1 1 0 0 1 0-1.414l3-3a1 1 0 0 1 1.414 0Z" />
					<path d="M10.357 3h3.286c1.084 0 1.958 0 2.666.058.729.06 1.369.185 1.961.487a5 5 0 0 1 2.185 2.185c.302.592.428 1.233.487 1.961C21 8.4 21 9.273 21 10.357v3.286c0 1.084 0 1.958-.058 2.666-.06.729-.185 1.369-.487 1.961a5 5 0 0 1-2.185 2.185c-.592.302-1.232.428-1.961.487C15.6 21 14.727 21 13.643 21h-3.286c-1.084 0-1.958 0-2.666-.058-.728-.06-1.369-.185-1.96-.487a5 5 0 0 1-2.186-2.185c-.302-.592-.428-1.232-.487-1.961C3 15.6 3 14.727 3 13.643v-3.286c0-1.084 0-1.958.058-2.666.06-.728.185-1.369.487-1.96A5 5 0 0 1 5.73 3.544c.592-.302 1.233-.428 1.961-.487C8.4 3 9.273 3 10.357 3ZM7.854 5.051c-.605.05-.953.142-1.216.276a3 3 0 0 0-1.311 1.311c-.134.263-.226.611-.276 1.216C5.001 8.471 5 9.264 5 10.4v3.2c0 1.137 0 1.929.051 2.546.05.605.142.953.276 1.216a3 3 0 0 0 1.311 1.311c.263.134.611.226 1.216.276.617.05 1.41.051 2.546.051h3.2c1.137 0 1.929 0 2.546-.051.605-.05.953-.142 1.216-.276a3 3 0 0 0 1.311-1.311c.134-.263.226-.611.276-1.216.05-.617.051-1.41.051-2.546v-3.2c0-1.137 0-1.929-.051-2.546-.05-.605-.142-.953-.276-1.216a3 3 0 0 0-1.311-1.311c-.263-.134-.611-.226-1.216-.276C15.529 5.001 14.736 5 13.6 5h-3.2c-1.137 0-1.929 0-2.546.051Z" />
				</svg>
			);
		case "line-chart":
			return (
				<svg
					className={className}
					viewBox="0 0 20 20"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="m14.034 7.569-1.225 2.45a2.493 2.493 0 0 1 1.49.745l1.226-2.45a2.494 2.494 0 0 1-1.491-.745Zm-2.612 2.675a2.51 2.51 0 0 0-1.178 1.178L8.578 9.756a2.51 2.51 0 0 0 1.178-1.178l1.666 1.666ZM5.701 9.235l-1.225 2.45a2.493 2.493 0 0 1 1.49.746l1.225-2.45a2.493 2.493 0 0 1-1.49-.746Z"
					/>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M16.667 5.833a.833.833 0 1 1-1.667 0 .833.833 0 0 1 1.667 0Zm1.667 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm-10 1.667a.833.833 0 1 1-1.667 0 .833.833 0 0 1 1.667 0ZM10 7.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm-5 6.667a.833.833 0 1 1-1.666 0 .833.833 0 0 1 1.666 0Zm1.667 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm5.833-.834a.833.833 0 1 0 0-1.666.833.833 0 0 0 0 1.666Zm0 1.667a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
					/>
				</svg>
			);
		case "coins":
			return (
				<svg className={className} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M4.167 5a2.5 2.5 0 0 1 2.5-2.5H10a2.5 2.5 0 0 1 .658 4.912c.113.285.175.596.175.921 0 .446-.116.864-.32 1.226.159.102.306.222.437.356a4.19 4.19 0 0 0-1.15 1.21.831.831 0 0 0-.633-.292H5.833a.833.833 0 0 0 0 1.667h3.334a.837.837 0 0 0 .084-.004 4.155 4.155 0 0 0 1.195 3.842A2.498 2.498 0 0 1 8.333 17.5H5a2.5 2.5 0 0 1-1.346-4.607 2.489 2.489 0 0 1-.32-1.226c0-.446.116-.864.32-1.227a2.501 2.501 0 0 1 .688-4.52A2.493 2.493 0 0 1 4.167 5Zm4.166 2.5a.833.833 0 1 1 0 1.667H5A.833.833 0 1 1 5 7.5h3.333ZM10 5.833H6.667a.833.833 0 1 1 0-1.666H10a.833.833 0 0 1 0 1.666Zm-1.667 8.334a.833.833 0 1 1 0 1.666H5a.833.833 0 1 1 0-1.666h3.333Z"
					/>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M13.334 10.833a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Zm-4.167 2.5a4.167 4.167 0 1 1 8.333 0 4.167 4.167 0 0 1-8.333 0Z"
					/>
				</svg>
			);
		case "timeline":
			return (
				<svg className={className} viewBox="0 0 20 21" xmlns="http://www.w3.org/2000/svg">
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M6.666 6.032a.833.833 0 1 0 0 1.666H10a.833.833 0 0 0 0-1.666H6.666Zm.834 4.166c0-.46.373-.833.833-.833h3.333a.833.833 0 1 1 0 1.667H8.333a.833.833 0 0 1-.833-.834Zm1.666 3.334c0-.46.373-.834.834-.834h3.333a.833.833 0 1 1 0 1.667H10a.833.833 0 0 1-.834-.833Z"
					/>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M8.631 2.698h2.738c.903 0 1.632 0 2.222.048.607.05 1.14.155 1.634.406a4.167 4.167 0 0 1 1.82 1.821c.252.494.357 1.027.407 1.635.048.59.048 1.318.048 2.221v2.738c0 .903 0 1.632-.048 2.222-.05.607-.155 1.14-.406 1.634a4.167 4.167 0 0 1-1.821 1.821c-.494.252-1.027.356-1.634.406-.59.048-1.319.048-2.222.048H8.631c-.903 0-1.632 0-2.222-.048-.607-.05-1.14-.154-1.634-.406a4.167 4.167 0 0 1-1.82-1.82c-.252-.494-.357-1.028-.407-1.635-.048-.59-.048-1.319-.048-2.222V8.83c0-.903 0-1.631.048-2.221.05-.608.155-1.141.406-1.635a4.167 4.167 0 0 1 1.821-1.82c.494-.252 1.027-.357 1.634-.407.59-.048 1.319-.048 2.222-.048Zm-2.086 1.71c-.504.04-.794.118-1.013.23A2.5 2.5 0 0 0 4.439 5.73c-.112.22-.188.51-.23 1.013-.042.514-.042 1.175-.042 2.122v2.667c0 .947 0 1.607.042 2.121.042.504.118.794.23 1.014a2.5 2.5 0 0 0 1.093 1.092c.22.112.509.189 1.013.23.514.042 1.175.043 2.122.043h2.666c.947 0 1.608-.001 2.122-.043.504-.041.794-.118 1.013-.23a2.5 2.5 0 0 0 1.093-1.092c.112-.22.188-.51.23-1.014.042-.514.042-1.174.042-2.121V8.865c0-.947 0-1.608-.042-2.122-.042-.504-.118-.794-.23-1.013a2.5 2.5 0 0 0-1.093-1.093c-.22-.111-.509-.188-1.013-.23-.514-.041-1.175-.042-2.122-.042H8.667c-.947 0-1.608 0-2.122.043Z"
					/>
				</svg>
			);
		case "grid":
			return (
				<svg className={className} viewBox="0 0 20 21" xmlns="http://www.ww3.org/2000/svg">
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M14.193 2.77h-.053c-.366 0-.68 0-.942.018-.275.018-.55.06-.821.172a2.5 2.5 0 0 0-1.353 1.353 2.559 2.559 0 0 0-.173.822c-.018.26-.018.576-.018.942v1.72c0 .365 0 .68.018.942.019.274.06.55.173.821a2.5 2.5 0 0 0 1.353 1.353c.271.112.546.154.821.172.261.018.576.018.942.018h.053c.366 0 .681 0 .942-.018.275-.018.55-.06.822-.172A2.5 2.5 0 0 0 17.31 9.56c.112-.272.154-.547.172-.821.018-.261.018-.577.018-.942v-1.72c0-.366 0-.681-.018-.942a2.556 2.556 0 0 0-.172-.822 2.5 2.5 0 0 0-1.353-1.353 2.557 2.557 0 0 0-.822-.172c-.26-.018-.576-.018-.942-.018ZM13.014 4.5a.968.968 0 0 1 .298-.05c.197-.013.455-.013.855-.013.4 0 .657 0 .855.014.19.012.262.035.297.049a.833.833 0 0 1 .45.451.967.967 0 0 1 .05.297c.014.198.014.456.014.855V7.77c0 .4 0 .658-.014.855a.967.967 0 0 1-.05.297.833.833 0 0 1-.45.451.966.966 0 0 1-.297.05c-.198.013-.456.014-.855.014-.4 0-.658 0-.855-.014a.967.967 0 0 1-.298-.05.833.833 0 0 1-.45-.45.97.97 0 0 1-.05-.298 14.16 14.16 0 0 1-.014-.855V6.103c0-.4 0-.657.014-.855a.97.97 0 0 1 .05-.297.833.833 0 0 1 .45-.451ZM5.86 9.437h-.053c-.366 0-.681 0-.942.017-.275.02-.55.06-.822.173A2.5 2.5 0 0 0 2.69 10.98a2.558 2.558 0 0 0-.172.821c-.018.261-.018.577-.018.942v1.72c0 .366 0 .681.018.942.019.275.06.55.172.822a2.5 2.5 0 0 0 1.353 1.353c.272.112.547.153.822.172.26.018.576.018.942.018h.053c.366 0 .68 0 .942-.018.275-.019.55-.06.821-.172a2.5 2.5 0 0 0 1.353-1.353c.113-.272.154-.547.173-.822.018-.26.018-.576.018-.942v-1.72c0-.365 0-.68-.018-.942a2.558 2.558 0 0 0-.173-.821 2.5 2.5 0 0 0-1.353-1.353 2.557 2.557 0 0 0-.821-.173c-.261-.017-.576-.017-.942-.017Zm-1.179 1.73a.967.967 0 0 1 .297-.05c.198-.013.456-.014.855-.014.4 0 .658 0 .856.014.19.013.262.035.297.05a.833.833 0 0 1 .45.45.967.967 0 0 1 .05.298c.014.197.014.455.014.855v1.667c0 .4 0 .657-.014.855a.966.966 0 0 1-.05.297.833.833 0 0 1-.45.45.963.963 0 0 1-.297.05c-.198.014-.456.014-.856.014-.4 0-.657 0-.855-.014a.963.963 0 0 1-.297-.05.833.833 0 0 1-.45-.45.966.966 0 0 1-.05-.297 14.098 14.098 0 0 1-.014-.855V12.77c0-.4 0-.658.014-.855a.967.967 0 0 1 .05-.297.833.833 0 0 1 .45-.451ZM5 2.77a2.5 2.5 0 0 0 0 5h1.667a2.5 2.5 0 0 0 0-5H5Zm-.833 2.5c0-.46.373-.833.833-.833h1.667a.833.833 0 0 1 0 1.666H5a.833.833 0 0 1-.833-.833ZM13.333 12.77a2.5 2.5 0 0 0 0 5H15a2.5 2.5 0 0 0 0-5h-1.667Zm-.833 2.5c0-.46.373-.833.833-.833H15a.833.833 0 0 1 0 1.666h-1.667a.833.833 0 0 1-.833-.833Z"
					/>
				</svg>
			);
		case "user":
			return (
				<svg className={className} viewBox="0 0 20 21" xmlns="http://www.w3.org/2000/svg">
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M7.5 13.603a2.5 2.5 0 0 0-2.5 2.5c0 .46.373.834.833.834h8.333c.46 0 .834-.373.834-.834a2.5 2.5 0 0 0-2.5-2.5h-5Zm-4.167 2.5A4.167 4.167 0 0 1 7.5 11.937h5a4.167 4.167 0 0 1 4.166 4.166 2.5 2.5 0 0 1-2.5 2.5H5.833a2.5 2.5 0 0 1-2.5-2.5ZM10 3.603a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Zm-4.167 2.5a4.167 4.167 0 1 1 8.333 0 4.167 4.167 0 0 1-8.333 0Z"
					/>
				</svg>
			);
		case "chevron-left":
			return (
				<svg
					width="20"
					height="20"
					viewBox="0 0 20 20"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M12.5 15L7.5 10L12.5 5"
						stroke="#343A3F"
						strokeWidth="1.6"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			);
		case "chevron-right":
			return (
				<svg
					width="20"
					height="20"
					viewBox="0 0 20 20"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M7.5 15L12.5 10L7.5 5"
						stroke="#343A3F"
						strokeWidth="1.6"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			);
		case "ellipsis":
			return (
				<svg
					className={className}
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<circle cx="12" cy="12" r="1" />
					<circle cx="19" cy="12" r="1" />
					<circle cx="5" cy="12" r="1" />
				</svg>
			);
		case "stacked-column-down":
			return (
				<svg className={className} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M12 7.333a.667.667 0 1 0 0 1.334h1.333a.667.667 0 1 0 0-1.334H12Zm-.667 3.334c0-.368.299-.667.667-.667h1.333a.667.667 0 0 1 0 1.333H12a.667.667 0 0 1-.667-.666Zm0 2.666c0-.368.299-.666.667-.666h1.333a.667.667 0 0 1 0 1.333H12a.667.667 0 0 1-.667-.667ZM7.334 4.667a.667.667 0 1 0 0 1.333h1.333a.667.667 0 0 0 0-1.333H7.334ZM6.667 8c0-.368.298-.667.667-.667h1.333a.667.667 0 0 1 0 1.334H7.334A.667.667 0 0 1 6.667 8Zm.667 2a.667.667 0 1 0 0 1.333h1.333a.667.667 0 0 0 0-1.333H7.334Zm0 2.667a.667.667 0 0 0 0 1.333h1.333a.667.667 0 0 0 0-1.333H7.334ZM2.667 2a.667.667 0 0 0 0 1.333H4A.667.667 0 1 0 4 2H2.667ZM2 5.333c0-.368.298-.666.667-.666H4A.667.667 0 1 1 4 6H2.667A.667.667 0 0 1 2 5.333Zm.667 2a.667.667 0 0 0 0 1.334H4a.667.667 0 0 0 0-1.334H2.667ZM2 10.667c0-.368.298-.667.667-.667H4a.667.667 0 0 1 0 1.333H2.667A.667.667 0 0 1 2 10.667Zm0 2.666c0-.368.298-.666.667-.666H4A.667.667 0 1 1 4 14H2.667A.667.667 0 0 1 2 13.333Z"
					/>
				</svg>
			);
		case "coins-alt":
			return (
				<svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M14.5 5a4.5 4.5 0 0 1 .41 8.982l.18 1.992A6.5 6.5 0 1 0 8.026 8.91l1.992.18A4.5 4.5 0 0 1 14.5 5Z"
					/>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M9.5 10a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm6.5 4.5a6.5 6.5 0 1 0-13 0 6.5 6.5 0 0 0 13 0Z"
					/>
				</svg>
			);
		case "calendar":
			return (
				<svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M8.759 5h6.482c.805 0 1.47 0 2.01.044.563.046 1.08.145 1.565.392a4 4 0 0 1 1.748 1.748c.247.485.346 1.002.392 1.564.044.541.044 1.206.044 2.01v4.483c0 .805 0 1.47-.044 2.01-.046.563-.145 1.08-.392 1.565a4 4 0 0 1-1.748 1.748c-.485.247-1.002.346-1.564.392-.541.044-1.206.044-2.01.044H8.758c-.805 0-1.47 0-2.01-.044-.563-.046-1.08-.145-1.565-.392a4 4 0 0 1-1.748-1.748c-.247-.485-.346-1.002-.392-1.564C3 16.71 3 16.046 3 15.242v-4.483c0-.805 0-1.47.044-2.01.046-.563.145-1.08.392-1.565a4 4 0 0 1 1.748-1.748c.485-.247 1.002-.346 1.564-.392C7.29 5 7.954 5 8.758 5ZM6.91 7.038c-.438.035-.663.1-.819.18a2 2 0 0 0-.874.874c-.08.156-.145.38-.18.819C5 9.361 5 9.943 5 10.8v4.4c0 .857 0 1.439.038 1.889.035.438.1.663.18.819a2 2 0 0 0 .874.874c.156.08.38.145.819.18C7.361 19 7.943 19 8.8 19h6.4c.857 0 1.439 0 1.889-.038.438-.035.663-.1.819-.18a2 2 0 0 0 .874-.874c.08-.156.145-.38.18-.819.037-.45.038-1.032.038-1.889v-4.4c0-.857 0-1.439-.038-1.889-.035-.438-.1-.663-.18-.819a2 2 0 0 0-.874-.874c-.156-.08-.38-.145-.819-.18C16.639 7 16.057 7 15.2 7H8.8c-.857 0-1.439 0-1.889.038Z"
					/>
					<path d="M9 4a1 1 0 0 0-2 0v2a1 1 0 0 0 2 0V4ZM17 4a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0V4Z" />
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M8 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm5-1a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-4 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-5 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
					/>
				</svg>
			);
		case "trend-up-circle":
			return (
				<svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<rect width="24" height="24" rx="12" fill="currentColor" />
					<path
						d="M18.6139 8.41333C18.5463 8.25043 18.4168 8.12098 18.2539 8.05333C18.1738 8.01917 18.0877 8.00105 18.0006 8H14.6673C14.4905 8 14.3209 8.07024 14.1959 8.19526C14.0708 8.32029 14.0006 8.48986 14.0006 8.66667C14.0006 8.84348 14.0708 9.01305 14.1959 9.13807C14.3209 9.2631 14.4905 9.33333 14.6673 9.33333H16.3939L12.6673 13.06L10.4739 10.86C10.412 10.7975 10.3382 10.7479 10.257 10.7141C10.1758 10.6802 10.0886 10.6628 10.0006 10.6628C9.9126 10.6628 9.82547 10.6802 9.74423 10.7141C9.66299 10.7479 9.58925 10.7975 9.52728 10.86L5.52728 14.86C5.46479 14.922 5.4152 14.9957 5.38135 15.0769C5.3475 15.1582 5.33008 15.2453 5.33008 15.3333C5.33008 15.4213 5.3475 15.5085 5.38135 15.5897C5.4152 15.671 5.46479 15.7447 5.52728 15.8067C5.58925 15.8692 5.66299 15.9187 5.74423 15.9526C5.82547 15.9864 5.9126 16.0039 6.00061 16.0039C6.08862 16.0039 6.17576 15.9864 6.25699 15.9526C6.33823 15.9187 6.41197 15.8692 6.47394 15.8067L10.0006 12.2733L12.1939 14.4733C12.2559 14.5358 12.3297 14.5854 12.4109 14.6193C12.4921 14.6531 12.5793 14.6705 12.6673 14.6705C12.7553 14.6705 12.8424 14.6531 12.9237 14.6193C13.0049 14.5854 13.0786 14.5358 13.1406 14.4733L17.3339 10.2733V12C17.3339 12.1768 17.4042 12.3464 17.5292 12.4714C17.6542 12.5964 17.8238 12.6667 18.0006 12.6667C18.1774 12.6667 18.347 12.5964 18.472 12.4714C18.597 12.3464 18.6673 12.1768 18.6673 12V8.66667C18.6662 8.57955 18.6481 8.49348 18.6139 8.41333Z"
						fill="white"
					/>
				</svg>
			);
		case "trend-down-circle":
			return (
				<svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<rect width="24" height="24" rx="12" fill="currentColor" />
					<path
						d="M18.6139 15.5867C18.5463 15.7496 18.4168 15.879 18.2539 15.9467C18.1738 15.9808 18.0877 15.9989 18.0006 16H14.6673C14.4905 16 14.3209 15.9298 14.1959 15.8047C14.0708 15.6797 14.0006 15.5101 14.0006 15.3333C14.0006 15.1565 14.0708 14.987 14.1959 14.8619C14.3209 14.7369 14.4905 14.6667 14.6673 14.6667H16.3939L12.6673 10.94L10.4739 13.14C10.412 13.2025 10.3382 13.2521 10.257 13.2859C10.1758 13.3198 10.0886 13.3372 10.0006 13.3372C9.9126 13.3372 9.82547 13.3198 9.74423 13.2859C9.66299 13.2521 9.58925 13.2025 9.52728 13.14L5.52728 9.14C5.46479 9.07802 5.4152 9.00429 5.38135 8.92305C5.3475 8.84181 5.33008 8.75467 5.33008 8.66667C5.33008 8.57866 5.3475 8.49152 5.38135 8.41028C5.4152 8.32904 5.46479 8.25531 5.52728 8.19333C5.58925 8.13085 5.66299 8.08125 5.74423 8.04741C5.82547 8.01356 5.9126 7.99613 6.00061 7.99613C6.08862 7.99613 6.17576 8.01356 6.25699 8.04741C6.33823 8.08125 6.41197 8.13085 6.47394 8.19333L10.0006 11.7267L12.1939 9.52667C12.2559 9.46418 12.3297 9.41459 12.4109 9.38074C12.4921 9.34689 12.5793 9.32947 12.6673 9.32947C12.7553 9.32947 12.8424 9.34689 12.9237 9.38074C13.0049 9.41459 13.0786 9.46418 13.1406 9.52667L17.3339 13.7267V12C17.3339 11.8232 17.4042 11.6536 17.5292 11.5286C17.6542 11.4036 17.8238 11.3333 18.0006 11.3333C18.1774 11.3333 18.347 11.4036 18.472 11.5286C18.597 11.6536 18.6673 11.8232 18.6673 12V15.3333C18.6662 15.4205 18.6481 15.5065 18.6139 15.5867Z"
						fill="white"
					/>
				</svg>
			);
		case "exclamation-circle":
			return (
				<svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12Z"
					/>
					<path d="M13 8C13 7.44772 12.5523 7 12 7C11.4477 7 11 7.44772 11 8V12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12V8Z" />
					<path d="M12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15Z" />
				</svg>
			);
		case "check-square":
			return (
				<svg
					className={className}
					viewBox="0 0 20 20"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M13.0893 7.74408C13.4147 8.06951 13.4147 8.59715 13.0893 8.92259L9.75594 12.2559C9.43051 12.5814 8.90287 12.5814 8.57743 12.2559L6.91076 10.5893C6.58533 10.2638 6.58533 9.73618 6.91076 9.41074C7.2362 9.08531 7.76384 9.08531 8.08928 9.41074L9.16669 10.4882L11.9108 7.74408C12.2362 7.41864 12.7638 7.41864 13.0893 7.74408Z"
						fill="#12131A"
					/>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M8.63099 2.5H11.369C12.2722 2.49999 13.0006 2.49999 13.5905 2.54818C14.1979 2.59781 14.7314 2.70265 15.225 2.95414C16.009 3.35361 16.6464 3.99103 17.0459 4.77504C17.2973 5.26862 17.4022 5.80211 17.4518 6.40948C17.5 6.99938 17.5 7.72783 17.5 8.63097V11.369C17.5 12.2722 17.5 13.0006 17.4518 13.5905C17.4022 14.1979 17.2973 14.7314 17.0459 15.225C16.6464 16.009 16.009 16.6464 15.225 17.0459C14.7314 17.2973 14.1979 17.4022 13.5905 17.4518C13.0006 17.5 12.2722 17.5 11.369 17.5H8.63097C7.72783 17.5 6.99937 17.5 6.40948 17.4518C5.80211 17.4022 5.26862 17.2973 4.77504 17.0459C3.99103 16.6464 3.35361 16.009 2.95414 15.225C2.70265 14.7314 2.59781 14.1979 2.54818 13.5905C2.49999 13.0006 2.49999 12.2722 2.5 11.369V8.63099C2.49999 7.72784 2.49999 6.99938 2.54818 6.40948C2.59781 5.80211 2.70265 5.26862 2.95414 4.77504C3.35361 3.99103 3.99103 3.35361 4.77504 2.95414C5.26862 2.70265 5.80211 2.59781 6.40948 2.54818C6.99938 2.49999 7.72784 2.49999 8.63099 2.5ZM6.5452 4.20931C6.04089 4.25052 5.75115 4.32733 5.53169 4.43915C5.06129 4.67883 4.67883 5.06129 4.43915 5.53169C4.32733 5.75115 4.25052 6.04089 4.20931 6.5452C4.16732 7.05924 4.16667 7.7195 4.16667 8.66667V11.3333C4.16667 12.2805 4.16732 12.9408 4.20931 13.4548C4.25052 13.9591 4.32733 14.2488 4.43915 14.4683C4.67883 14.9387 5.06129 15.3212 5.53169 15.5609C5.75115 15.6727 6.04089 15.7495 6.5452 15.7907C7.05924 15.8327 7.7195 15.8333 8.66667 15.8333H11.3333C12.2805 15.8333 12.9408 15.8327 13.4548 15.7907C13.9591 15.7495 14.2488 15.6727 14.4683 15.5609C14.9387 15.3212 15.3212 14.9387 15.5609 14.4683C15.6727 14.2488 15.7495 13.9591 15.7907 13.4548C15.8327 12.9408 15.8333 12.2805 15.8333 11.3333V8.66667C15.8333 7.7195 15.8327 7.05924 15.7907 6.5452C15.7495 6.04089 15.6727 5.75115 15.5609 5.53169C15.3212 5.06129 14.9387 4.67883 14.4683 4.43915C14.2488 4.32733 13.9591 4.25052 13.4548 4.20931C12.9408 4.16732 12.2805 4.16667 11.3333 4.16667H8.66667C7.7195 4.16667 7.05924 4.16732 6.5452 4.20931Z"
						fill="#12131A"
					/>
				</svg>
			);
		case "check-circle":
			return (
				<svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12Z"
					/>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M15.7071 9.29289C16.0976 9.68342 16.0976 10.3166 15.7071 10.7071L11.7071 14.7071C11.3166 15.0976 10.6834 15.0976 10.2929 14.7071L8.29289 12.7071C7.90237 12.3166 7.90237 11.6834 8.29289 11.2929C8.68342 10.9024 9.31658 10.9024 9.70711 11.2929L11 12.5858L14.2929 9.29289C14.6834 8.90237 15.3166 8.90237 15.7071 9.29289Z"
					/>
				</svg>
			);
		case "plus-square":
			return (
				<svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M12 7C12.5523 7 13 7.44772 13 8V11H16C16.5523 11 17 11.4477 17 12C17 12.5523 16.5523 13 16 13H13V16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16V13H8C7.44772 13 7 12.5523 7 12C7 11.4477 7.44772 11 8 11H11V8C11 7.44772 11.4477 7 12 7Z"
						fill="#F1F1F1"
					/>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M10.3572 3H13.6428C14.7266 2.99999 15.6007 2.99998 16.3086 3.05782C17.0375 3.11737 17.6777 3.24318 18.27 3.54497C19.2108 4.02433 19.9757 4.78924 20.455 5.73005C20.7568 6.32234 20.8826 6.96253 20.9422 7.69138C21 8.39925 21 9.27339 21 10.3572V13.6428C21 14.7266 21 15.6008 20.9422 16.3086C20.8826 17.0375 20.7568 17.6777 20.455 18.27C19.9757 19.2108 19.2108 19.9757 18.27 20.455C17.6777 20.7568 17.0375 20.8826 16.3086 20.9422C15.6008 21 14.7266 21 13.6428 21H10.3572C9.27339 21 8.39925 21 7.69138 20.9422C6.96253 20.8826 6.32234 20.7568 5.73005 20.455C4.78924 19.9757 4.02433 19.2108 3.54497 18.27C3.24318 17.6777 3.11737 17.0375 3.05782 16.3086C2.99998 15.6007 2.99999 14.7266 3 13.6428V10.3572C2.99999 9.27341 2.99998 8.39926 3.05782 7.69138C3.11737 6.96253 3.24318 6.32234 3.54497 5.73005C4.02433 4.78924 4.78924 4.02433 5.73005 3.54497C6.32234 3.24318 6.96253 3.11737 7.69138 3.05782C8.39926 2.99998 9.27341 2.99999 10.3572 3ZM7.85424 5.05118C7.24907 5.10062 6.90138 5.19279 6.63803 5.32698C6.07354 5.6146 5.6146 6.07354 5.32698 6.63803C5.19279 6.90138 5.10062 7.24907 5.05118 7.85424C5.00078 8.47108 5 9.26339 5 10.4V13.6C5 14.7366 5.00078 15.5289 5.05118 16.1458C5.10062 16.7509 5.19279 17.0986 5.32698 17.362C5.6146 17.9265 6.07354 18.3854 6.63803 18.673C6.90138 18.8072 7.24907 18.8994 7.85424 18.9488C8.47108 18.9992 9.26339 19 10.4 19H13.6C14.7366 19 15.5289 18.9992 16.1458 18.9488C16.7509 18.8994 17.0986 18.8072 17.362 18.673C17.9265 18.3854 18.3854 17.9265 18.673 17.362C18.8072 17.0986 18.8994 16.7509 18.9488 16.1458C18.9992 15.5289 19 14.7366 19 13.6V10.4C19 9.26339 18.9992 8.47108 18.9488 7.85424C18.8994 7.24907 18.8072 6.90138 18.673 6.63803C18.3854 6.07354 17.9265 5.6146 17.362 5.32698C17.0986 5.19279 16.7509 5.10062 16.1458 5.05118C15.5289 5.00078 14.7366 5 13.6 5H10.4C9.26339 5 8.47108 5.00078 7.85424 5.05118Z"
						fill="#F1F1F1"
					/>
				</svg>
			);
		case "arrow-down":
			return (
				<svg
					className={className}
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M15.0428 9.54289L12.2499 12.3358L9.45703 9.54289L8.04282 10.9571L11.5428 14.4571C11.9333 14.8476 12.5665 14.8476 12.957 14.4571L16.457 10.9571L15.0428 9.54289Z"
						fill="currentColor"
					/>
				</svg>
			);
		case "arrow-down-square-solid":
			return (
				<svg className={className} viewBox="0 0 24 25" xmlns="http://www.w3.org/2000/svg">
					<rect width="24" height="24" transform="translate(0 0.5)" />
					<path
						d="M15.0428 10.0429L12.2499 12.8358L9.45703 10.0429L8.04282 11.4571L11.5428 14.9571C11.9333 15.3476 12.5665 15.3476 12.957 14.9571L16.457 11.4571L15.0428 10.0429Z"
						fill="white"
						fillOpacity="0.58"
					/>
				</svg>
			);
		case "coin-insert":
			return (
				<svg
					width="30"
					height="30"
					viewBox="0 0 30 30"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M15 23.75C19.8325 23.75 23.75 19.8325 23.75 15C23.75 10.1675 19.8325 6.25 15 6.25C10.1675 6.25 6.25 10.1675 6.25 15C6.25 19.8325 10.1675 23.75 15 23.75ZM15 26.25C21.2132 26.25 26.25 21.2132 26.25 15C26.25 8.7868 21.2132 3.75 15 3.75C8.7868 3.75 3.75 8.7868 3.75 15C3.75 21.2132 8.7868 26.25 15 26.25Z"
						fill="currentColor"
					/>
					<path
						d="M3.75 25C3.75 24.3096 4.30964 23.75 5 23.75H25C25.6904 23.75 26.25 24.3096 26.25 25V25C26.25 25.6904 25.6904 26.25 25 26.25H5C4.30964 26.25 3.75 25.6904 3.75 25V25Z"
						fill="currentColor"
					/>
				</svg>
			);
		default:
			return null;
	}
};
