import { useRef } from 'react';

import { useLanguageContext } from '../contexts/LanguageContext';
import { useRouter } from '../contexts/RouterContext';
import { FIT_IN_ALL_ROUTES } from '../utils/constants';
import { matchPath, type MatchResult } from '../utils/matchPath';
import { resolveSlash } from '../utils/resolveSlash';

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
};

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
};

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
	base?: string
): MatchResult<Record<string, string>> | null => {
	if ( searchParams ) {
		const _search = Array.isArray(searchParams) ? searchParams : [searchParams];

		const _url = hash ? new URL(url.hash.replace('#', ''), url.origin) : new URL(url as unknown as string);

		const keys = Array.from(_url.searchParams.keys());
		if ( _search.some((search) => !keys.some((key) => key === search || search.replace(/\[\d\]/, '') === key)) ) {
			return null;
		}
	}
	
	const paths = Array.isArray(path) ? path : [path];
	const length = paths.length;
	for (let i = 0; i < length; i++) {
		const p = paths[i];

		const _path = p.includes(FIT_IN_ALL_ROUTES) 
			? p 
			: (
				p.startsWith('#')
					? p
					: resolveSlash(base, p)
			);

		const match = matchPath(
			url, 
			{
				path: _path,
				hash,
				baseURL: url.origin,
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
	matchResult?: MatchResult | null
) => {
	const { url } = useRouter();
	const baseContext = useLanguageContext();
	const ref = useRef<MatchResult | null | undefined>();

	if ( !ref.current || !ref.current.checkNewVersion(url) ) {
		const _matchResult = matchResult ?? matchRoute(
			url, 
			matchProps,
			matchProps.path, 
			baseContext
		);

		ref.current = _matchResult;
	}

	return ref.current;
};
