import { createNewUrlWithSearch, parseParams } from '@resourge/react-search-params';

import { resolveLocation, resolveSlash } from '../../utils/resolveLocation';
import { isValidUrl } from '../../utils/utils';

export type NavigateTo = string | URL | {
	searchParams: Record<string, any>
};

export const normalizeUrl = (
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

	const newUrl = new URL(url as unknown as string);

	const newSearch = parseParams(to.searchParams);

	return new URL(createNewUrlWithSearch(newUrl, newSearch, hash) as unknown as string);
};
