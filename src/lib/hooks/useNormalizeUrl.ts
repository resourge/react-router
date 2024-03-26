import { createNewUrlWithSearch, parseParams } from '@resourge/react-search-params';

import { useLanguageContext } from '../contexts/LanguageContext';
import { useRoute } from '../contexts/RouteContext';
import { resolveLocation, resolveSlash } from '../utils/resolveLocation';
import { isValidUrl } from '../utils/utils';

export type NavigateTo = string | URL | {
	searchParams: Record<string, any>
}

const normalizeUrl = (
	to: NavigateTo, 
	url: URL,
	base?: string,
	hash?: boolean
): URL => {
	// If to is string, resolve to with current url
	if ( typeof to === 'string' ) {
		if ( to.startsWith(`/${base}`) ) {
			return resolveLocation(to, url.href);
		}
		if ( isValidUrl(to) ) {
			return new URL(to);
		}
		return resolveLocation(base ? resolveSlash(base, to) : to, url.href);
	}

	if ( to instanceof URL ) {
		return to;
	}

	const newUrl = new URL(url);

	const newSearch = parseParams(to.searchParams);

	return new URL(createNewUrlWithSearch(newUrl, newSearch, hash));
};

/**
 * Returns a method for making a url from `to`.
 * 
 * to - Can an string, URL or { searchParams: object }.
 * * Note: { searchParams: object } will replace current `URL` URLSearchParams
 */
export const useNormalizeUrl = () => {
	const { hash } = useRoute();
	const base = useLanguageContext();

	return (to: NavigateTo) => {
		return normalizeUrl(
			to,
			new URL(window.location.href),
			base,
			hash
		);
	};
};
