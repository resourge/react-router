import { type ReactNode } from 'react';

import { LanguageContext } from '../../contexts/LanguageContext';
import { useRouter } from '../../contexts/RouterContext';
import { ORIGIN } from '../../utils/constants';
import { resolveSlash } from '../../utils/resolveSlash';
import { WINDOWS } from '../../utils/window/window';
import Navigate from '../navigate/Navigate';

const LANGUAGE_PARAM = '/:lang';
const LANGUAGE_PATTERN = new URLPattern({
	baseURL: ORIGIN,
	hostname: '*',
	port: '*',
	protocol: '*',
	pathname: `${LANGUAGE_PARAM}{/*}?`,
	hash: '*',
	search: '*'
});

/**
 * Update the language in the route if different from the current one.
 * @param newLanguage - The new language to update to.
 */
export const updateLanguageRoute = (newLanguage: string) => {
	const newUrl = new URL(window.location.href);
	const match = LANGUAGE_PATTERN.exec(newUrl.href);

	if ( match ) {
		const { lang } = match.pathname.groups;

		if ( lang && lang !== newLanguage ) {
			newUrl.pathname = newUrl.pathname.replace(`/${lang}`, `/${newLanguage}`);

			if (window.location.href !== newUrl.href) {
				window.history.replaceState(null, '', newUrl.href);
			}
		}
	}
};

/**
 * Get the language from the current route.
 * @returns The language code from the route, if present.
 */
export const getLanguageRoute = () => {
	const newUrl = new URL(WINDOWS.location.href);
	const match = LANGUAGE_PATTERN.exec(newUrl.href);
	
	return match?.pathname.groups.lang;
};

/**
 * Check if a language is supported.
 * @param lang - The language code to check.
 * @returns The language if supported, otherwise false.
 */
function isLangSupported(lang: string): string | false {
	try {
		const [supportedLang] = Intl.Collator.supportedLocalesOf(lang);
		return supportedLang ? new Intl.Locale(supportedLang).language : false;
	}
	catch {
		return false;
	}
}

export type LanguageRouteProps = {
	children: ReactNode

	/**
	 * Languages allowed
	 */
	languages: string[]

	/**
	 * To custom check "lang"
	 * Ex: When user tries to use languages the website doesn't support
	 */
	checkLanguage?: (lang?: string) => boolean

	/**
	 * Incase there is no language or the language is not accepted
	 * @default first from languages
	 */
	fallbackLanguage?: string
};

/**
 * Get a new pathname based on language checks.
 * @param url - The URL to modify.
 * @param languages - Supported languages.
 * @param fallbackLanguage - Fallback language if the current one is not valid.
 * @param lang - Current language from the route.
 * @param checkLanguage - Custom function to validate the language.
 * @returns The new pathname.
 */
function getNewPathName(
	url: URL,
	languages: string[],
	fallbackLanguage: string,
	lang?: string,
	checkLanguage?: ((lang?: string) => boolean)
) {
	if ( lang ) {
		if ( checkLanguage && !checkLanguage(lang) ) {
			const newUrl = new URL(url.toString());
			return newUrl.pathname.replace(`/${lang}`, `/${fallbackLanguage}`);
		}
		
		const language = isLangSupported(lang);
		if ( language ) {
			const newUrl = new URL(url.href);
			return newUrl.pathname.replace(
				`/${lang}`, 
				languages.includes(language)
					? `/${language}`
					: `/${fallbackLanguage}`
			);
		}
	}
	
	return resolveSlash(fallbackLanguage, url.href.replace(url.origin, ''));
}

/**
 * Component that makes sure language is present at the begin of the route
 */
function LanguageRoute({
	children, checkLanguage, languages, fallbackLanguage = languages[0] 
}: LanguageRouteProps): JSX.Element {
	const { url } = useRouter();
	const match = LANGUAGE_PATTERN.exec(url.href);
	const lang = match?.pathname.groups.lang;

	if ( !lang || !languages.includes(lang) ) {
		const newPathname = getNewPathName(url, languages, fallbackLanguage, lang, checkLanguage);

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
