import { useLayoutEffect, useState } from 'react';

import { useLanguageContext } from '../../contexts/LanguageContext';

export const useHtmlLanguage = () => {
	const baseLanguage = useLanguageContext();
	const [lang, setLang] = useState(baseLanguage);

	useLayoutEffect(() => {
		const _language = baseLanguage ?? document.documentElement.lang;

		// eslint-disable-next-line react-hooks/set-state-in-effect
		setLang(_language);

		const observer = new MutationObserver(() => {
			setLang(document.documentElement.lang);
		});

		if ( !baseLanguage ) {
			const elementToObserve = document.querySelector('html')!;
			observer.observe(elementToObserve, {
				attributeFilter: ['lang'],
				attributes: true 
			});
		}

		return () => {
			observer.disconnect();
		};
	}, [baseLanguage]);

	return lang;
};
