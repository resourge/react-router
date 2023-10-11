import { useRef } from 'react';

import { useLanguageContext } from '../contexts/LanguageContext';
import { type RouteContextObject } from '../contexts/RouteContext';
import { useRouter } from '../contexts/RouterContext';
import { type AnyPath } from '../setupPaths/Path';
import { matchPath, type MatchResult } from '../utils/matchPath';
import { resolveSlash } from '../utils/resolveLocation';

export type MatchPathProps = {
	/**
	 * Route path(s)
	 * @default '*'
	 */
	path: string | string[] | AnyPath[] | AnyPath
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

/**
 * Method to match `url` to `url`
 * 
 * @param url {URL} - Current url.
 * @param matchPath {MatchPathProps}
 * @param parentRoute {MatchResult} - Current route parent.
 */
export const matchRoute = (
	url: URL,
	{ hash, exact }: Omit<MatchPathProps, 'path'>, 
	path: MatchPathProps['path'],
	parentRoute: MatchResult | undefined,
	base?: string
): MatchResult<Record<string, string>> | null => {
	const baseURL = url.origin;
	const href = url.href;
	
	const paths = (Array.isArray(path) ? path : [path]);

	const length = paths.length;
	for (let i = 0; i < length; i++) {
		const p = paths[i];
		let routePath: string = p as string;
		let metadata = parentRoute ? parentRoute.metadata : {};
		if ( typeof p === 'object' ) {
			routePath = p.path;
			metadata = {
				...metadata,
				...p._metadata 
			};
		}

		let _path = resolveSlash(base, routePath);

		let hashPath = hash ? routePath : undefined;
	
		if ( parentRoute ) {
			_path = resolveSlash(parentRoute.path, !hash ? _path.replace(parentRoute.path, '') : '');
			if ( parentRoute.hashPath ) {
				hashPath = resolveSlash(parentRoute.hashPath, (hashPath ?? '').replace(parentRoute.hashPath, ''));
			}
		}
	
		const match = matchPath(
			href, 
			{
				path: _path,
				hash,
				hashPath,
				baseURL,
				exact,
				currentPath: routePath,
				paths
			},
			// @ts-expect-error For developer only
			metadata
		)

		if ( match ) {
			return match;
		}
	}

	return null;
}

/**
 * Hook to match path to current `url`.
 * @returns null if it is a no match, otherwise returns {@link MatchResult}
 */
export const useMatchPath = (
	matchProps: MatchPathProps, 
	parentRoute?: RouteContextObject<Record<string, any>>,
	matchResult?: MatchResult | null
) => {
	const { url } = useRouter()
	const baseContext = useLanguageContext()
	const ref = useRef<MatchResult | null | undefined>();

	const _matchResult = matchResult ?? matchRoute(
		url, 
		matchProps,
		matchProps.path, 
		parentRoute,
		baseContext
	);

	// This is to make sure only routes that changed are render again
	if ( !ref.current || !_matchResult || ref.current.unique !== _matchResult.unique ) {
		ref.current = _matchResult;
	}

	return ref.current
}
