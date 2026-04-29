import { type ReactNode } from 'react';

import { ORIGIN } from '../../utils/constants';
import { resolveSlash } from '../../utils/resolveSlash';
import { WINDOWS } from '../../utils/window/window';

export const LANGUAGE_PARAM = '/:lang';
export const LANGUAGE_PATTERN = new URLPattern({
	baseURL: ORIGIN,
	hash: '*',
	hostname: '*',
	pathname: `${LANGUAGE_PARAM}{/*}?`,
	port: '*',
	protocol: '*',
	search: '*'
});

/**
 * Update the language in the route if different from the current one.
 * @param newLanguage - The new language to update to.
 */
export const updateLanguageRoute = (newLanguage: string) => {
	const newUrl = new URL(globalThis.location.href);
	const match = LANGUAGE_PATTERN.exec(newUrl.href);

	if ( match ) {
		const { lang } = match.pathname.groups;

		if ( lang && lang !== newLanguage ) {
			newUrl.pathname = newUrl.pathname.replace(`/${lang}`, `/${newLanguage}`);

			if (globalThis.location.href !== newUrl.href) {
				globalThis.history.replaceState(null, '', newUrl.href);
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

type GetNewPathNameConfigType = {
	checkLanguage?: ((lang?: string) => boolean)
	fallbackLanguage: string
	lang?: string
	languages: string[]
	url: URL
};

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
 * Get a new pathname based on language checks.
 * @param url - The URL to modify.
 * @param languages - Supported languages.
 * @param fallbackLanguage - Fallback language if the current one is not valid.
 * @param lang - Current language from the route.
 * @param checkLanguage - Custom function to validate the language.
 * @returns The new pathname.
 */
export function getNewPathName({
	checkLanguage,
	fallbackLanguage,
	lang,
	languages,
	url
}: GetNewPathNameConfigType) {
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
 * Check if a language is supported.
 * @param lang - The language code to check.
 * @returns The language if supported, otherwise false.
 */
export function isLangSupported(lang: string): false | string {
	try {
		const [supportedLang] = Intl.Collator.supportedLocalesOf(lang);
		return supportedLang
			? new Intl.Locale(supportedLang).language
			: false;
	}
	catch {
		return false;
	}
}
