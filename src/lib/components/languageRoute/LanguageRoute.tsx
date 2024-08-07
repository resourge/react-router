import { type ReactNode } from 'react';

import { ORIGIN } from 'src/lib/utils/constants';
import { WINDOWS } from 'src/lib/utils/window/window';

import { LanguageContext } from '../../contexts/LanguageContext';
import { useRouter } from '../../contexts/RouterContext';
import { resolveSlash } from '../../utils/resolveLocation';
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
 * Method to update language in route
 * @returns 
 */
export const updateLanguageRoute = (newLanguage: string) => {
	const newUrl = new URL(window.location.href);

	const match = LANGUAGE_PATTERN.exec(newUrl.href);

	if ( match ) {
		const matchUrl = match.pathname;

		const lang = matchUrl.groups.lang;

		if ( lang && lang !== newLanguage ) {
			newUrl.pathname = newUrl.pathname.replace(`/${lang}`, `/${newLanguage}`);

			if ( window.location.href === newUrl.href ) {
				return;
			}
			
			window.history.replaceState(null, '', newUrl);
		}
	}
};

/**
 * Method to get initial route language
 * @returns 
 */
export const getLanguageRoute = () => {
	const newUrl = new URL(WINDOWS.location.href);

	const match = LANGUAGE_PATTERN.exec(newUrl.href);

	if ( match ) {
		const matchUrl = match.pathname;

		const lang = matchUrl.groups.lang;

		return lang;
	}
};

function isLangIsSupported(lang: string): string | false {
	try {
		const languages = Intl.Collator.supportedLocalesOf(lang);
		if ( languages.length === 0 ) {
			return false;
		}

		return new Intl.Locale(languages[0]).language;
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
		else {
			const language = isLangIsSupported(lang);
			if ( language ) {
				const newUrl = new URL(url as unknown as string);
				return newUrl.pathname.replace(
					`/${lang}`, 
					languages.includes(language)
						? `/${language}`
						: `/${fallbackLanguage}`
				);
			}
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

	let lang: string | undefined;
	if ( match ) {
		const matchUrl = match.pathname;

		lang = matchUrl.groups.lang;
	}

	if ( !lang || !languages.includes(lang) ) {
		const newPathname = getNewPathName(url, languages, fallbackLanguage, lang, checkLanguage);

		return (
			<Navigate
				replace={true}
				to={newPathname}
			/>
		);
	}

	const urlThatEndsWithLangWithoutSlash = `${url.origin}/${lang}`;
	if ( url.href === urlThatEndsWithLangWithoutSlash ) {
		return (
			<Navigate
				replace={true}
				to={`${urlThatEndsWithLangWithoutSlash}/`}
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
