import { useEffect, useState } from "react";

export const useLocales = () => {
	const [locales, setLocales] = useState<readonly string[]>();

	useEffect(() => {
		setLocales(navigator.languages)
	}, [])

	return locales
}
