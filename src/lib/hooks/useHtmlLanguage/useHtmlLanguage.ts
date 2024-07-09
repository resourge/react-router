import { useLayoutEffect, useState } from 'react';

import { useLanguageContext } from '../../contexts/LanguageContext';

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
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const elementToObserve = document.querySelector('html')!;
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
