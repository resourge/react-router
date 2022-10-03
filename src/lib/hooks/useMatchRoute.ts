
import { useRef } from 'react';

import { useRoute } from '../contexts/RouteContext';
import { useRouter } from '../contexts/RouterContext';
import { matchPath, MatchResult } from '../utils/matchPath';

export type MatchPropsRoute = {
	/**
	 * Route path(s)
	 */
	path: string | string[]
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
 * @param matchRoute {MatchPropsRoute}
 * @param parentRoute {MatchResult} - Current route parent.
 */
export const matchRoute = (
	url: URL,
	{
		path, hash, exact
	}: MatchPropsRoute, 
	parentRoute: MatchResult | undefined
): MatchResult<Record<string, string>> | null => {
	const baseURL = url.origin;
	const href = url.href;
	
	const paths = (Array.isArray(path) ? path : [path]);

	const length = paths.length;
	for (let i = 0; i < length; i++) {
		const p = paths[i];
		let _path = paths[i];

		let hashPath = hash ? p : undefined;
	
		if ( parentRoute ) {
			_path = `${parentRoute.path}${!hash ? _path.replace(parentRoute.path, '') : ''}`
			if ( parentRoute.hashPath ) {
				hashPath = `${parentRoute.hashPath}${(hashPath ?? '').replace(parentRoute.hashPath, '')}`
			}
		}
	
		const match = matchPath(
			href, 
			{
				path: _path,
				hash,
				hashPath,
				baseURL,
				exact
			}
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
export const useMatchRoute = (matchProps: MatchPropsRoute, matchResult?: MatchResult | null) => {
	const { url } = useRouter()
	const parentRoute = useRoute();
	const ref = useRef<MatchResult | null | undefined>();

	const _matchResult = matchResult ?? matchRoute(url, matchProps, parentRoute);

	// This is to make sure only routes that changed are render again
	if ( !ref.current || !_matchResult || ref.current.unique !== _matchResult.unique ) {
		ref.current = _matchResult;
	}

	return ref.current
}
