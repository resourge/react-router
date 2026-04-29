import { type JSX, type ReactNode } from 'react';

import { LanguageContext } from '../../contexts/LanguageContext';
import { useRouter } from '../../contexts/RouterContext';
import Navigate from '../navigate/Navigate';

import { getNewPathName, LANGUAGE_PATTERN } from './LanguageRouteUtils';

export type LanguageRouteProps = {
	/**
	 * To custom check "lang"
	 * Ex: When user tries to use languages the website doesn't support
	 */
	checkLanguage?: (lang?: string) => boolean

	children: ReactNode

	/**
	 * Incase there is no language or the language is not accepted
	 * @default first from languages
	 */
	fallbackLanguage?: string

	/**
	 * Languages allowed
	 */
	languages: string[]
};

/**
 * Component that makes sure language is present at the begin of the route
 */
function LanguageRoute({
	checkLanguage, children, languages, fallbackLanguage = languages[0] 
}: LanguageRouteProps): JSX.Element {
	const { url } = useRouter();
	const match = LANGUAGE_PATTERN.exec(url.href);
	const lang = match?.pathname.groups.lang;

	if ( !lang || !languages.includes(lang) ) {
		const newPathname = getNewPathName({
			checkLanguage, 
			fallbackLanguage, 
			lang, 
			languages, 
			url
		});

		return (
			<Navigate
				replace={true}
				to={newPathname}
			/>
		);
	}

	const urlEndingWithLang = `${url.origin}/${lang}`;
	if ( url.href === urlEndingWithLang ) {
		return (
			<Navigate
				replace={true}
				to={`${urlEndingWithLang}/`}
			/>
		);
	}
	
	return (
		<LanguageContext.Provider 
			value={lang}
		>
			{ children }
		</LanguageContext.Provider>
	);
};

export default LanguageRoute;
