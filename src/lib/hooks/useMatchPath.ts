import { useRef } from 'react';

import { useLanguageContext } from '../contexts/LanguageContext';
import { type RouteContextObject } from '../contexts/RouteContext';
import { useRouter } from '../contexts/RouterContext';
import { FIT_IN_ALL_ROUTES } from '../utils/constants';
import { matchPath, type MatchResult } from '../utils/matchPath';
import { resolveSlash } from '../utils/resolveLocation';

export type BaseMatchPathProps = {
	/**
	 * Makes it so 'URL' needs to be exactly as the path
	 * @default false
	 */
	exact?: boolean
	/**
	 * Turn 'route' into 'hash route'
	 * @default false
	 */
	hash?: boolean
}

export type MatchPathProps = BaseMatchPathProps & {
	/**
	 * Route path(s)
	 * @default '*'
	 */
	path: string | string[]
	/**
	 * Route mandatory search params
	 */
	searchParams?: string | string[]
}

/**
 * Method to match `url` to `url`
 * 
 * @param url {URL} - Current url.
 * @param matchPath {BaseMatchPathProps}
 * @param parentRoute {MatchResult} - Current route parent.
 */
export const matchRoute = (
	url: URL,
	{
		hash, exact, searchParams 
	}: MatchPathProps, 
	path: MatchPathProps['path'],
	parentRoute: MatchResult | undefined,
	base?: string
): MatchResult<Record<string, string>> | null => {
	if ( searchParams ) {
		const _search = Array.isArray(searchParams) ? searchParams : [searchParams];

		const _url = hash ? new URL(url.hash.replace('#', ''), url.origin) : new URL(url);

		if ( _search.some((search) => !_url.searchParams.has(search)) ) {
			return null;
		}
	}

	const baseURL = url.origin;
	
	const paths = (Array.isArray(path) ? path : [path]);

	const length = paths.length;
	for (let i = 0; i < length; i++) {
		const p = paths[i];

		let _path = p.includes(FIT_IN_ALL_ROUTES) ? p : resolveSlash(base, p);

		let hashPath = hash ? p : undefined;
	
		if ( parentRoute ) {
			if ( !hash && parentRoute.path ) {
				_path = resolveSlash(parentRoute.path, _path.replace(parentRoute.path, ''));
			}
			if ( parentRoute.hashPath && hashPath) {
				hashPath = resolveSlash(parentRoute.hashPath, hashPath.replace(parentRoute.hashPath, ''));
			}
		}
	
		const match = matchPath(
			url, 
			{
				path: _path,
				hash,
				hashPath,
				baseURL,
				exact,
				currentPath: p,
				paths
			}
		);

		if ( match ) {
			return match;
		}
	}

	return null;
};

/**
 * Hook to match path to current `url`.
 * @returns null if it is a no match, otherwise returns {@link MatchResult}
 */
export const useMatchPath = (
	matchProps: MatchPathProps, 
	parentRoute?: RouteContextObject<Record<string, any>>,
	matchResult?: MatchResult | null
) => {
	const { url } = useRouter();
	const baseContext = useLanguageContext();
	const ref = useRef<MatchResult | null | undefined>();

	if ( !ref.current || (ref.current && !url.href.includes(ref.current.unique)) ) {
		const _matchResult = matchResult ?? matchRoute(
			url, 
			matchProps,
			matchProps.path, 
			parentRoute,
			baseContext
		);

		ref.current = _matchResult;

		return _matchResult;
	}

	return ref.current;
};
