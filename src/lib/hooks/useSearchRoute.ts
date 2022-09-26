import { useRef } from 'react'

import { useRoute } from '../contexts/RouteContext'
import { useUrl } from '../contexts/RouterContext'
import { MatchResult } from '../utils/matchPath'

import { MatchPropsRoute, matchRoute } from './useMatchRoute'

export type UseSearchRouteProps = {
	/**
	 * Route search
	 */
	search: string | string[]
} & Omit<MatchPropsRoute, 'path'>

/**
 * Method to match `search(s)` to `url`
 * 
 * @param url {URL} - Current url.
 * @param matchRoute {UseSearchRouteProps}
 * @param parentRoute {MatchResult} - Current route parent.
 */
export const matchSearchRoute = (
	url: URL,
	{
		search, hash, exact
	}: UseSearchRouteProps, 
	parentRoute: MatchResult | undefined
) => {
	const _search = Array.isArray(search) ? search : [search];

	const hashUrl = new URL(url.hash.replace('#', ''), url.origin)

	if ( _search.every((search) => hashUrl.searchParams.has(search)) ) {
		const matchProps: MatchPropsRoute = {
			path: '*',
			exact,
			hash
		}

		return matchRoute(url, matchProps, parentRoute);
	}

	return null;
}

/**
 * Hook to match search(s) to current `url`.
 * @returns null if it is a no match, otherwise returns {@link MatchResult}
 */
export const useSearchRoute = (matchSearchProps: UseSearchRouteProps, computedMatch?: MatchResult | null) => {
	const url = useUrl()
	const parentRoute = useRoute();
	const ref = useRef<MatchResult | null | undefined>();
	
	const _matchResult = computedMatch ?? matchSearchRoute(url, matchSearchProps, parentRoute);

	// This is to make sure only routes that changed are render again
	if ( 
		!ref.current || 
			!_matchResult || 
			(ref.current.unique !== _matchResult.unique) 
	) {
		ref.current = _matchResult;
	}

	return ref.current;
}
