import { parseParams } from '@resourge/history-store/utils';

import { ORIGIN } from './constants';
import { WINDOWS } from './window/window';

export function getHrefWhenHashOrNormal(url: URL, hash?: boolean) {
	if ( hash ) {
		return `${url.origin}${url.hash.substring(1)}`;
	}
	const hashIndex = url.href.indexOf('#');
	return url.href.substring(0, hashIndex > -1 ? hashIndex : undefined);
}

export function isValidUrl(urlString: string) {
	try { 
		return Boolean(new URL(urlString)); 
	}
	catch (e) { 
		return false; 
	}
}

export function createPathWithCurrentLocationHasHash(path: string) {
	const newPath = new URL(path, ORIGIN);

	const windowURL = new URL(WINDOWS.location.href);
	newPath.hash = WINDOWS.location.pathname && WINDOWS.location.pathname !== '/' ? windowURL.href.replace(windowURL.origin, '') : '';

	return newPath.href.replace(newPath.origin, '');
}

export function getParams<Params>(params: Params, beforePaths: Array<(params: Params) => void>) {
	const _params: Exclude<Params, undefined> = (params ? {
		...params 
	} : {}) as Exclude<Params, undefined>;

	beforePaths.forEach((beforePaths) => {
		beforePaths(_params);
	});

	return _params;
}

export function getSearchParams<Params extends { searchParams?: any }>(params?: Params) {
	if ( params && params.searchParams ) {
		const _params: Exclude<Params, undefined> = {
			...params.searchParams 
		};
		return parseParams(_params);
	}

	return '';
}
