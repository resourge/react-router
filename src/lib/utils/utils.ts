import { parseParams } from '@resourge/history-store/utils';

import { ORIGIN } from './constants';
import { WINDOWS } from './window/window';

/**
 * Returns the href based on whether to include the hash or not.
 * 
 * @param url - The URL object.
 * @param hash - Boolean indicating whether to include the hash in the result.
 * @returns The href string with or without hash based on the `hash` parameter.
 */
export function getHrefWhenHashOrNormal(url: URL, hash?: boolean) {
	if ( hash ) {
		return `${url.origin}${url.hash.substring(1)}`;
	}
	const hashIndex = url.href.indexOf('#');
	return url.href.substring(0, hashIndex > -1 ? hashIndex : undefined);
}

/**
 * Validates if the provided string is a valid URL.
 * 
 * @param urlString - The URL string to validate.
 * @returns True if valid URL, false otherwise.
 */
export function isValidUrl(urlString: string) {
	try { 
		return Boolean(new URL(urlString)); 
	}
	catch (e) { 
		return false; 
	}
}

/**
 * Get current the current location's hash if applicable.
 * 
 * @returns The current location.
 */
export function getCurrentLocationHasHash() {
	const windowURL = new URL(WINDOWS.location.href);
	
	return WINDOWS.location.pathname && WINDOWS.location.pathname !== '/' 
		? windowURL.href.replace(windowURL.origin, '') 
		: '';
}

/**
 * Creates a path by appending the current location's hash if applicable.
 * 
 * @param path - The base path to which the current location's hash is appended.
 * @returns The resulting path with the hash from the current location if applicable.
 */
export function createPathWithCurrentLocationHasHash(
	path: string, 
	currentUrl?: string
) {
	const newPath = new URL(path, ORIGIN);

	// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
	newPath.hash = currentUrl || getCurrentLocationHasHash();

	return newPath.href.replace(newPath.origin, '');
}

/**
 * Applies transformations to params based on the provided functions.
 * 
 * @param params - The parameters object.
 * @param beforePaths - Array of functions to transform the params.
 * @returns The transformed params.
 */
export function getParams<Params>(params: Params, beforePaths: Array<(params: Params) => void>) {
	const _params: Exclude<Params, undefined> = (params ? {
		...params 
	} : {}) as Exclude<Params, undefined>;

	beforePaths.forEach((beforePaths) => {
		beforePaths(_params);
	});

	return _params;
}

/**
 * Extracts and parses search parameters from the provided params object.
 * 
 * @param params - Object potentially containing searchParams.
 * @returns The search parameters as a query string.
 */
export function getSearchParams<Params extends { searchParams?: any }>(params?: Params) {
	if ( params && params.searchParams ) {
		const _params: Exclude<Params, undefined> = {
			...params.searchParams 
		};
		return parseParams(_params);
	}

	return '';
}
