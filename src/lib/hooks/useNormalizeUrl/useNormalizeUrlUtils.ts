import { createNewUrlWithSearch, parseParams } from '@resourge/history-store/utils';

import { ORIGIN } from '../../utils/constants';
import { resolveSlash } from '../../utils/resolveSlash';
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
		return new URL(
			base ? resolveSlash(base, to) : to, 
			isValidUrl(to) ? undefined : ORIGIN
		);
	}

	// If 'to' is an instance of URL
	if ( to instanceof URL ) {
		return to;
	}

	const newUrl = new URL(url.href);
	const newSearch = parseParams(to.searchParams);

	return createNewUrlWithSearch(newUrl, newSearch, hash);
};
