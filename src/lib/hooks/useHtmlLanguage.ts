import { useLayoutEffect, useState } from 'react';

import { useLanguageContext } from '../contexts/LanguageContext';
import { type RouteMetadataType } from '../types/RouteMetadataType';

export type RouteMetadataProps = Omit<RouteMetadataType, 'route'>

export const useHtmlLanguage = () => {
	const baseLanguage = useLanguageContext();
	const [lang, setLang] = useState(baseLanguage);

	useLayoutEffect(() => {
		const _language = baseLanguage ?? document.documentElement.lang;

		setLang(_language);

		const observer = new MutationObserver(() => {
			setLang(document.documentElement.lang);
		});

		if ( !baseLanguage ) {
			const elementToObserve = document.querySelector('html') as HTMLHtmlElement;
			observer.observe(elementToObserve, {
				attributes: true,
				attributeFilter: ['lang'] 
			});
			return () => {
				observer.disconnect();
			};
		}

	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [baseLanguage]);

	return lang;
};
